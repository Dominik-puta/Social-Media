// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Like from "App/Models/Like";

export default class LikesController {

    public async likePost({ response, request, auth }) {
        const postId = request.only(['id']).id
        const likeuser = { 'postId': postId, 'userId': auth.user.id }
        console.log(likeuser);
        const like = await Like.query().where('user_id', likeuser.userId).where('post_id', likeuser.postId).first();
        if (like) {
            like.delete();
        } else {
            const likeToAdd = new Like();
            likeToAdd.user_id = likeuser.userId;
            likeToAdd.post_id = likeuser.postId;
            await likeToAdd.save();
        }

        return response.redirect('/');
    }
    public static async getLikes(postId) {
        const likes = await Like.query().where('post_id', postId)
        return likes.length;
    }
}
