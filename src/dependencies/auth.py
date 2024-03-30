"""
Auth
"""

import smtplib
import random
import hashlib
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from fastapi import Request, status, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import jwt, ExpiredSignatureError
from json import loads
from db.db import DBOperations
from dependencies.credentials import *

database: DBOperations


class ExpiredTokenException(HTTPException):
    """
    Expired token error
    """

    def __init__(self):
        super().__init__(status_code=401, detail="Token has expired.")


def set_db(db: DBOperations):
    """
    Set db
    """
    global database
    database = db
    print("login db setup: success!")


class Message:
    @staticmethod
    def send_password(login, password):
        gmail_user = GMAIL_LOGIN
        gmail_password = GMAIL_PASSWORD

        email_content = f"<h3>You have logged via Google Account, so we generated you password for regular login:</h3>\
        <p>Login: {login}</p>\
        <p>Password: {password}</p>\
        <h4>With all the love,</h4>\
        <h4>UCUbook Team</h4>"

        # Create the email message
        msg = MIMEText(email_content, "html")
        msg["Subject"] = "UCUBook Password"
        msg["From"] = gmail_user
        msg["To"] = login

        # Send the email
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.send_message(msg)
        server.quit()
        print(f"message sent to {login}")

    @staticmethod
    def send_invitation(email, event_title, event_details, date, time_from, time_to):
        """
        Send an email with an attached .ics file to add an event to a calendar.
        """
        gmail_user = GMAIL_LOGIN
        gmail_password = GMAIL_PASSWORD

        event_start = datetime.strptime(
            f"{date} {time_from}", "%Y-%m-%d %H:%M"
        ).strftime("%Y%m%dT%H%M%SZ")
        event_end = datetime.strptime(f"{date} {time_to}", "%Y-%m-%d %H:%M").strftime(
            "%Y%m%dT%H%M%SZ"
        )

        ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:UCUBook
BEGIN:VEVENT
UID:{datetime.utcnow().strftime('%Y%m%dT%H%M%S')}@yourdomain.com
DTSTAMP:{datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')}
DTSTART:{event_start}
DTEND:{event_end}
SUMMARY:Booking
DESCRIPTION:Room's booking confirmation
END:VEVENT
END:VCALENDAR
"""
        msg = MIMEMultipart()
        msg["Subject"] = f"Підтвердження: {event_title}"
        msg["From"] = gmail_user
        msg["To"] = email

        email_body = MIMEText(
            f"Вам підтвердили {event_title}. Ви можете додати собі дату в календар, щоб не забути.\n\nЗ любов'ю,\nUCUBook"
        )
        msg.attach(email_body)

        ics_part = MIMEApplication(ics_content, Name="invite.ics")
        ics_part["Content-Disposition"] = 'attachment; filename="invite.ics"'
        msg.attach(ics_part)

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.sendmail(gmail_user, email, msg.as_string())
        server.quit()
        print(f"надіслано успішно: {email}")

    def reject_mail(email, time, district, room_number):
        email_content = f"<h3>Вам відмовили у бронюванні аудиторії {district} №{room_number} на {time}</h3>\
        <p>Нам щиро шкода,</p>\
        <p>UCUbook Team</p>"
        gmail_user = GMAIL_LOGIN
        gmail_password = GMAIL_PASSWORD

        # Create the email message
        msg = MIMEText(email_content, "html")
        msg["Subject"] = "UCUBook Booking Denied"
        msg["From"] = gmail_user
        msg["To"] = email

        # Send the email
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.send_message(msg)
        server.quit()


class Authentication:
    """
    Auth class
    """

    @staticmethod
    def hash_password(password):
        password_bytes = password.encode("utf-8")
        hashed_bytes = hashlib.sha256(password_bytes).digest()
        hashed_password = hashlib.sha256(password_bytes).hexdigest()
        return hashed_password

    @staticmethod
    def generate_password(length=8, lowercase=True, uppercase=True, digitsS=True):
        """Generates a random password with specified character sets using random.choices."""
        lowercase_letters = "abcdefghijklmnopqrstuvwxyz"
        uppercase_letters = lowercase_letters.upper()
        digits = "0123456789"
        char_sets = ""
        if lowercase:
            char_sets += lowercase_letters
        if uppercase:
            char_sets += uppercase_letters
        if digitsS:
            char_sets += digits
        password = "".join(random.choices(char_sets, k=length))
        return password

    @staticmethod
    def create_access_token(data: dict):
        """
        Access token creation
        """
        to_encode = data.copy()
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        expire = datetime.utcnow() + expires_delta
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def authenticate_user(data, via_google=False):
        """
        User authentication
        """
        try:
            user_data = database.get_data("users", data["login"])[0]
            if via_google:
                return user_data["login"]
            elif (
                Authentication.hash_password(data["password"]) == user_data["password"]
            ):
                return user_data["login"]
            else:
                return None
        except ValueError:
            if "@" in data["login"]:
                password = Authentication.generate_password()
                password_for_db = Authentication.hash_password(password)
                database.add_data(
                    "users",
                    {
                        "login": data["login"],
                        "password": password_for_db,
                        "can_rent": True,
                        "group": 1,
                        "display_name": data["name"],
                    },
                )
                Message.send_password(data["login"], password)
                return data["login"]
            else:
                return None

    @staticmethod
    def get_current_user(request: Request):
        """
        Get current user
        """
        token = request.cookies.get("access_token")
        try:
            if token:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                username = payload.get("user")
                token_expires = payload.get("exp")

                if (
                    username is None
                    or token_expires is None
                    or datetime.utcnow() > datetime.fromtimestamp(token_expires)
                ):
                    raise HTTPException(
                        status_code=status.HTTP_307_TEMPORARY_REDIRECT,
                        detail="Please log in",
                        headers={"Location": "/login"},
                    )
                else:
                    return username
            else:
                raise HTTPException(
                    status_code=status.HTTP_307_TEMPORARY_REDIRECT,
                    detail="Please log in",
                    headers={"Location": "/login"},
                )
        except ExpiredSignatureError as err:
            raise ExpiredTokenException() from err
