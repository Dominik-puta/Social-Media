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

