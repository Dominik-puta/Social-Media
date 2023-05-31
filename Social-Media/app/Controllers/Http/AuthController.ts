import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User';
import Mail from '@ioc:Adonis/Addons/Mail'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Token from 'App/Models/Token';

export default class AuthController {
    public async registerShow({ view }: HttpContextContract) {
        return view.render('auth/register');
    }
    public async register({ request, response, auth }: HttpContextContract) {
        const userSchema = schema.create({
            username: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'username', caseInsensitive: true })]),
            email: schema.string({ trim: true }, [rules.email(), rules.unique({ table: 'users', column: 'username', caseInsensitive: true })]),
            password: schema.string({}, [rules.minLength(8)])
        })
        const data = await request.validate({ schema: userSchema });
        const user = await User.create(data);

        const token = await Token.create({
            user_id: user.id,
            token: Encryption.encrypt(user.id.toString() + user.createdAt),
            type: "email_verification",
        });
        await Mail.send((message) => {
            message
                .from("dominik@adonis.com") // Replace with your own email
                .to(user.email)
                .subject("Email verification")
                .htmlView("emails/verification", { token: token.token });
        });

        await auth.login(user);
        return response.redirect('/');

    }

    public async loginShow({ view }: HttpContextContract) {
        return view.render('auth/login');
    }
    public async login({ request, response, auth, session }: HttpContextContract) {
        const { uid, password } = request.only(['uid', 'password'])

        try {
            await auth.attempt(uid, password)
        } catch (error) {
            session.flash('form', 'Your username, email or password is inncorect');
            return response.redirect().back();
        }

        return response.redirect('/');




    }
    public async logout({ response, auth, session }: HttpContextContract) {
        await auth.logout();
        session.flash('form', 'You logged out');
        return response.redirect().toRoute('auth.login.show');
    }
}
