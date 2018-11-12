from flask import (
    Blueprint, redirect, render_template, request, url_for, g, jsonify, abort, Response, current_app, send_from_directory
)

from SSRS.auth import force_login
from SSRS.model import db, User, Sheet, Question

bp = Blueprint('institute', __name__, url_prefix='/institute')

# send recommendation content to institute
@bp.route('commit', methods=['POST'])
def commit():

    return Response('commit')
