from flask import (
    Blueprint, redirect, render_template, request, url_for, g, jsonify, abort, Response, current_app, send_from_directory
)
import smtplib
from email.mime.text import MIMEText
from email.header import Header

from SSRS.auth import force_login
from SSRS.model import db, User

bp = Blueprint('referee', __name__, url_prefix='/referee')

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
        #return jsonify(success=False)
        return abort(404)

    reminded_referrer = institute.referrers[data['index']-1]
    if send_reminding_mail(user, reminded_referrer) is True:
        print('remind success')
        return jsonify(success=True)
    else:
        return jsonify(success=False)


@bp.route('/submit', methods=['POST'])
@force_login('referee.submit')
def submit():
    data = request.get_json()
    user = User.query.filter_by(id=g.user.id).first()
    for inst in user.institutes:
        if inst.title == data['institute']:
            if send_institute_mail(inst) is True:
                return jsonify(success=True)
            else:
                return jsonify(success=False)
    return jsonify(success=False)

def send_reminding_mail(user, referrer):
    """
        url: /referrer/submit/<referrer_id>
    """
    try:
        recommend_url = request.url_root + 'referrer/submit/' + str(referrer.id)
        mail_content = '''
        %s%s 您好:
        學生 %s 邀請您撰寫推薦信，

        請點擊以下網址，即可進入撰寫推薦信畫面！
        %s
        ''' % (referrer.name, referrer.title, user.name, recommend_url)

        receiver_name = referrer.name + referrer.title
        send_mail([referrer.mail], mail_content, receiver_name)
        return True
    except Exception as e:
        print('Failure to send mail')
        print(e)
        return False

def send_institute_mail(institute):
    try:
        mail_content = '''
        %s 您好，這是關於 %s 之所有推薦信內容：


        '''

        for referrer in institute.referrers:
            mail_content += '推薦人: ' + referrer.name + referrer.title + '\n'
            mail_content += '聯絡電話: ' + referrer.phone + '\n'
            mail_content += 'E-mail: ' + referrer.mail + '\n'

            content = referrer.contents[0]
            field = referrer.contents[0].fields[0]

            mail_content += '''
            推薦內容:
                專業能力: %s
                口語能力: %s
                寫作能力: %s
                領導力  : %s
                合作能力: %s
                評論    : %s


            ''' % (field.profession, field.oral_skill,
                   field.writing_skill, field.ledaership,
                   field.cooperation, content.comment)

        receiver_name = institute.title
        send_mail([institute.mail], mail_content, receiver_name)
        return True
    except:
        print('Failure to send mail')
        return False

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
