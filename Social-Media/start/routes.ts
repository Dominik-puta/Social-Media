/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import FriendshipsController from 'App/Controllers/Http/FriendshipsController';
import PostsController from 'App/Controllers/Http/PostsController';
import LikesController from 'App/Controllers/Http/LikesController';
import AuthController from 'App/Controllers/Http/AuthController';
import Token from 'App/Models/Token';

Route.get('/', 'PostsController.showFeed').as('post.showFeed');
Route.get('register', 'AuthController.registerShow').as('auth.register.show');
Route.post('register', 'AuthController.register').as('auth.register');
Route.get('login', 'AuthController.loginShow').as('auth.login.show');
Route.post('login', 'AuthController.login').as('auth.login');
Route.get('logout', 'AuthController.logout').as('auth.logout');
Route.get('friends', 'FriendshipsController.friendsShow').as('friends.show');
Route.post('addFriend', 'FriendshipsController.addFriend').as('friends.addFriend');
Route.post('removeFriend', 'FriendshipsController.deleteFriend').as('friends.deleteFriend');
Route.post('addpost', 'PostsController.addPost').as('post.addPost');
Route.post('deletepost', 'PostsController.deletePost').as('post.deletePost');
Route.post('likepost', 'LikesController.likePost').as('like.likePost');
Route.get("/verify-email", async ({ view, request, response }) => {
    const token = request.input("token");

    if (!token) {
        return response.redirect("/");
    }

    const existingToken = await Token.query()
        .preload("user")
        .where("token", token)
        .first();

    if (!existingToken) {
        return response.redirect("/");
    }

    // Update the user attached to the token and save.
    existingToken.user.email_verified = true;
    existingToken.user.save();

    // Delete the token
    await existingToken.delete();

    return view.render("emails/verified");
});

