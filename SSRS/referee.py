from flask import (
    Blueprint, redirect, render_template, request, url_for, g, jsonify, abort, Response, current_app, send_from_directory
)
import smtplib
from email.mime.text import MIMEText
from email.header import Header

from SSRS.auth import force_login
from SSRS.model import db, User

bp = Blueprint('referee', __name__, url_prefix='/referee')

# return recommender infoes
@bp.route('/get_referrers/<institute_name>', methods=['GET'])
@force_login('referee.get_referrers')
def get_referrers(institute_name):
    referrers = None
    referrers_data = dict()
    user = User.query.filter_by(id=g.user.id).first()
    for institute in user.institutes:
        if institute.title == institute_name:
            referrers = institute.recommenders
            break

    for i, referrer in enumerate(referrers):
        index = 'referrer' + str(i)
        referrers_data[index] = dict()
        referrers_data[index][index+'-name'] = referrer.name
        referrers_data[index][index+'-title'] = referrer.title
        referrers_data[index][index+'-phone'] = referrer.phone
        referrers_data[index][index+'-mail'] = referrer.mail
        referrers_data[index][index+'-state'] = referrer.state

    return jsonify(referrers=referrers_data)

# send remind mail
@bp.route('/remind/<int:order>', methods=['POST'])
@force_login('referee.remind')
def remind(order):
    user = User.query.filter_by(id=g.user.id).first()
    try:
        reminded_rcmder = user.recommenders[order]
    except:
        return Response('Fail reminding')

    send_reminding_mail(reminded_rcmder)
    return Response('Success reminding')

# commit to institute
@bp.route('commit', methods=['POST'])
@force_login('referee.commit')
def commit():

    return Response('Commit')


# add school name
@bp.route('add_school', methods=['POST'])
def add():

    return Response('add')

# get rendered data
@bp.route('/get_full_data', methods=['GET'])
@force_login('referee.get_full_data')
def get_full_data():
    data = request.get_json()
    user = User.query.filter_by(id=g.user.id).first()
    returned = list()
    # gather all user specified data
    for inst in user.institutes:
        referrer_info = list()
        for referrer in inst.referrers:
            referrer_info.append({'name': referrer.name,
                                  'title': referrer.title,
                                  'phone': referrer.phone,
                                  'mail': referrer.mail,
                                  'state': referrer.state
                                 })
        returned_item = dict(institute={'name': inst.title,
                                        'mail': inst.mail
                                       },
                             referrers=referrer_info
                            )
        returned.append(returned_item)

    return jsonify(returned)

@bp.route('/save', methods=['POST'])
@force_login('referee.save')
def save():
    data = request.get_json()
    user = User.query.filter_by(id=g.user.id).first()
    new_institute = Institute(mail=data['institute_mail'],
                              title=data['institute_name'],
                              users=user)
    for referrer in data['referrers']:
        new_referrer = Referrer(name=referrer['name'],
                                title=referrer['title'],
                                phone=referrer['phone'],
                                mail=referrer['mail'],
                                state=True,
                                institutes=new_institute)
        db.session.add(new_referrer)
    db.session.add(new_institute)
    db.session.commit()
    return jsonify(success=True)

@bp.route('/send', methods=['POST'])
@force_login('referee.send')
def send():
    data = request.get_json()
    user = User.query.filter_by(id=g.user.id).first()
    institute = None
    found = False
    for inst in user.institutes:
        if inst.title == data['institute']:
            institute = inst
            found = True
            break
    if not found:
        return jsonify(success=False)

    reminded_referrer = institute.referrers[data['index']-1]
    if send_reminding_mail(reminded_referrer) is True:
        print('remind success')
        return jsonify(success=True)
    else:
        return jsonify(success=False)


@bp.route('/submit', methods=['POST'])
@force_login('referee.submit')
def submit():
    data = request.get_json()
    user = User.query.filter_by(id=g.use.id).first()
    for inst in user.institutes:
        if inst.title == data['institute']:
            if send_institute_mail(inst) is True:
                return jsonify(success=True)
            else:
                return jsonify(success=False)

def send_reminding_mail(referrer):
    """
        url: /referrer/<referrer_id>
    """
    pass
    receiver = [referrer.mail]
    mail_content = 'Hello, ' + name + ' ' + title + ':'
    # TODO
    recommend_url = 'url'

def send_institute_mail(institute):
    pass

def send_mail(receivers, mail_content, message_to_name):
    subject = '推薦信撰寫邀請'

    message = MIMEText(mail_content, 'plain', 'utf-8')
    message['From'] = Header('no-reply-remind', 'utf-8')
    message['To'] = Header(message_to_name, 'utf-8')
    message['Subject'] = Header(subject, 'utf-8')

    server = smtplib.SMTP_SSL(current_app.config['MAIL_HOST'], 465)
    server.ehlo()
    server.login(current_app.config['MAIL_USER'], current_app.config['MAIL_PASS'])
    server.sendmail(current_app.config['MAIL_USER'], receivers, message.as_string())
    print('success')
    server.quit()
