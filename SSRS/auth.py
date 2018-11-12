import functools
from flask import (
    Blueprint, redirect, render_template, request, session, url_for, flash, g
)
from werkzeug.security import check_password_hash, generate_password_hash
from SSRS.model import db, User

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        # TODO: 'username' -> form and variable name
        print(request.form)
        username = request.form['username']
        password = request.form['password']
        name = request.form['name']
        gender = request.form['gender']
        address = request.form['address']
        telephone_number = request.form['telephone_number']
        mail = request.form['mail']
        phone_number = request.form['phone_number']
        sid = request.form['sid']
        birthday = request.form['birthday']

        error_msg = None
        if not username:
            error_msg = 'Username is required'
        elif not password:
            error_msg = 'Password is required'
        elif User.query.filter_by(username=username).first() is not None:
            error_msg = 'User {} is already registered'.format(username)

        if error_msg is None:
            print(len(generate_password_hash(password, 'sha256')))
            new_user = User(username=username,
                            password=generate_password_hash(password, method='sha256'),
                            name=request.form['name'],
                            gender=request.form['gender'],
                            address=request.form['address'],
                            telephone_number=request.form['telephone_number'],
                            mail=request.form['mail'],
                            phone_number=request.form['phone_number'],
                            sid=request.form['sid'],
                            birthday = request.form['birthday'])
            db.session.add(new_user)
            db.session.commit()
            return redirect(url_for('auth.login'))

        flash(error_msg)

    return render_template('register.html', register='menu-active')

@bp.route('/login', methods=('GET', 'POST'))
def login():
    if request.method == 'POST':
        print(request.form)
        username = request.form['username']
        password = request.form['password']
        error_msg = None

        user = User.query.filter_by(username=username).first()
        if user is None:
            error_msg = 'Wrong username'
        elif not check_password_hash(user.password, password):
            error_msg = 'Wrong password'

        if error_msg is None:
            endpoint = session.get('next', 'index')
            session.clear()
            session['user_id'] = user.id
            return redirect(url_for(endpoint, sheet_id=request.args.get('sheet_id')))

        flash(error_msg)

    return render_template('login.html', login='menu-active')

@bp.before_app_request
def load_logging_in_user_data():
    user_id = session.get('user_id')
    if user_id is None:
        g.user = None
    else:
        g.user = User.query.filter_by(id=user_id).first()


@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

def force_login(endpoint):
    def deco(view):
        @functools.wraps(view)
        def wrapped_view(**kwargs):
            """if not logged in, redirect to login page"""
            if g.user is None:
                session['next'] = endpoint
                print("NO")
                return redirect(url_for('auth.login', sheet_id=kwargs.get('sheet_id')))
            return view(**kwargs)
        return wrapped_view
    return deco

