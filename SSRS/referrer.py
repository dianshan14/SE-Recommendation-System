from flask import (
    Blueprint, redirect, render_template, request, url_for, g, jsonify, abort, Response, current_app, send_from_directory
)

from SSRS.auth import force_login
from SSRS.model import db, Referrer, Content, Field

bp = Blueprint('referrer', __name__, url_prefix='/referrer')

# Redirect from email content, and route recommender to page that can fill out data
@bp.route('/submit/<referrer_id>', methods=['POST', 'GET'])
def submit(referrer_id):
    referrer = Referrer.query.filter_by(id=int(referrer_id)).first()
    if referrer.state is True:
        return render_template('finish.html')

    if request.method == 'POST':
        content = request.get_json()


        new_content = Content(comment=content['comment'],
                              referrers=referrer)

        new_field = Field(profession=content['profession'],
                          oral_skill=content['oral_skill'],
                          writing_skill=content['writeing_skill'],
                          leadership=content['leadership'],
                          cooperation=content['cooperation'],
                          contents=new_content)

        db.session.add(new_field)
        db.session.add(new_content)
        db.session.commit()

        return render_template('finish.html')

    return render_template('referrer.html')
