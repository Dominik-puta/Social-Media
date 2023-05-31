import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Friendship from 'App/Models/Friendship';
import User from 'App/Models/User';

export default class FriendshipsController {

    public async friendsShow({ auth, view }: HttpContextContract) {
        let friendlist: any[] = []
        let friend = {}
        const users = await Friendship.query().where('user_id', auth.user.id);
        for (let i = 0; i < users.length; i++) {
            const user = await User.query().where('id', users[i].friend_id)
            friend = {
                'username': user[0].username,
                'id': users[i].friend_id
            }
            friendlist.push(friend);
        }
        return view.render('friendlist', { friendlist: friendlist });

    }

    async show(id) {
        const friendshi = await Friendship.find(id)
    }

    public async addFriend({ request, auth, response, session }: HttpContextContract) {
        let userIdToAdd = await User.query().where('username', request.only(['username']).username)

        //* Check if found an user, will return 0 if user doesn't exist, in this case it will return back with a flash message
        if (userIdToAdd.length == 0) {
            session.flash('UnableToAdd', 'User not found');
            return response.redirect('/friends');
        }
        const friendship1 = new Friendship();
        const friendship2 = new Friendship();
        friendship1.user_id = auth.user.id;
        friendship1.friend_id = userIdToAdd[0].id;
        friendship2.user_id = userIdToAdd[0].id;
        friendship2.friend_id = auth.user.id;
        await friendship1.save();
        await friendship2.save();


        return response.redirect('/friends');
    }
    public async deleteFriend({ request, auth, response }: HttpContextContract) {
        const user = request.only(['id']);
        //  const friendship2 = await Friendship.findBy('user_id', auth.user?.id);
        const friendship1 = await Friendship.query().where('user_id', auth.user.id).where('friend_id', user.id).first();
        const friendship2 = await Friendship.query().where('user_id', user.id).where('friend_id', auth.user.id).first();
        friendship1?.delete();
        friendship2?.delete();
        return response.redirect('/friends');
    }


}
