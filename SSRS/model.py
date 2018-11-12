from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'sys_user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    name = db.Column(db.Text, nullable=False)
    gender = db.Column(db.Text, nullable=False)
    address = db.Column(db.Text, nullable=False)
    telephone_number = db.Column(db.Text, nullable=False)
    mail = db.Column(db.Text, nullable=False)
    phone_number = db.Column(db.Text, nullable=False)
    sid = db.Column(db.Text, nullable=False)
    birthday = db.Column(db.Text, nullable=False)

    institutes = db.relationship('Institute', backref='users')
    degrees = db.relationship('Degree', backref='users')

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Degree(db.Model):
    __tablename__ = 'degree'
    id = db.Column(db.Integer, primary_key=True)
    school_name = db.Column(db.Text, nullable=False)
    department_name = db.Column(db.Text, nullable=False)
    date = db.Column(db.Text, nullable=False)

    # backref : users
    user_id = db.Column(db.Integer, db.ForeignKey('sys_user.id'))

    def __repr__(self):
        return '<Degree {}>'.format(self.username)

class Institute(db.Model):
    __tablename__ = 'institute'
    id = db.Column(db.Integer, primary_key=True)
    mail = db.Column(db.Text, nullable=False)
    title = db.Column(db.Text, nullable=False)

    referrers = db.relationship('Referrer', backref='institutes')

    # backref : users
    user_id = db.Column(db.Integer, db.ForeignKey('sys_user.id'))

    def __repr__(self):
        return '<Institute {}>'.format(self.username)

class Referrer(db.Model):
    __tablename__ = 'referrer'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    title = db.Column(db.Text, nullable=False)
    phone = db.Column(db.Text, nullable=False)
    mail = db.Column(db.Text, nullable=False)
    state = db.Column(db.Boolean, nullable=False)

    contents = db.relationship('Content', backref='referrers')

    # backref : institutes
    institute_id = db.Column(db.Integer, db.ForeignKey('institute.id'))

    def __repr__(self):
        return '<Referrer {}>'.format(self.username)

class Content(db.Model):
    __tablename__ = 'content'
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.Text, nullable=False)

    fields = db.relationship('Field', backref='contents')

    # backref : referrers
    referrer_id = db.Column(db.Integer, db.ForeignKey('referrer.id'))

    def __repr__(self):
        return '<Content {}>'.format(self.username)

class Field(db.Model):
    __tablename__ = 'field'
    id = db.Column(db.Integer, primary_key=True)
    profession = db.Column(db.Text, primary_key=True)
    oral_skill = db.Column(db.Text, primary_key=True)
    writing_skill = db.Column(db.Text, primary_key=True)
    leadership = db.Column(db.Text, primary_key=True)
    cooperation = db.Column(db.Text, primary_key=True)

    # backref : contents
    content_id = db.Column(db.Integer, db.ForeignKey('content.id'))

    def __repr__(self):
        return '<Field {}>'.format(self.username)
