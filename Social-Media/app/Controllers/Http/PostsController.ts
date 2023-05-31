// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Friendship from "App/Models/Friendship";
import Post from "App/Models/Post";
import User from "App/Models/User";
import LikesController from "./LikesController";

export default class PostsController {
    public async addPost({ request, response, auth }) {
        let text = request.only(['text']).text;
        const post = new Post();
        post.user_id = auth.user.id;
        post.text = text;
        await post.save();
        return response.redirect('/');
    }
    public async showFeed({ response, auth, view }) {
        if (!auth.user) {
            return view.render('welcome');
        }
        let postlist: any[] = [];
        let post = {}
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
        //Dodajemo auth usera u friendlistu za prikazivanje njegovih postova
        friend = {
            'username': auth.user.username,
            'id': auth.user.id
        }
        friendlist.push(friend)
        for (let i = 0; i < friendlist.length; i++) {
            const posts = await Post.query().where('user_id', friendlist[i].id)
            if (posts)
                for (let j = 0; j < posts.length; j++) {
                    post = {
                        'text': posts[j].text,
                        'username': friendlist[i].username,
                        'userId': friendlist[i].id,
                        'postId': posts[j].id,
                        'createdAt': posts[j].createdAt,
                        'likes': await LikesController.getLikes(posts[j].id)
                    }
                    postlist.push(post);
                }
        }
        postlist.sort(this.dynamicSort('createdAt'));
        return view.render('welcome', { postlist: postlist });
    }
    public async deletePost({ request, response, auth }) {
        const postId = request.only(['id']).id;
        const post = await Post.query().where('id', postId).first();
        post?.delete();
        return response.redirect('/');
    }

    dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }




}
