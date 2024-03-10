from fastapi import Request, status, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import jwt, ExpiredSignatureError
from db.db import DBOperations

database: dict()

SECRET_KEY = "GyattSigmaTylerDurdenSkibidi"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

GOOGLE_CLIENT_ID = (
    "356012260444-2kprdauh0obsooujst2828biso6u5f9i.apps.googleusercontent.com"
)
GOOGLE_CLIENT_SECRET = "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"
GOOGLE_REDIRECT_URI = "http://localhost:8001/auth/google"
GOOGLE_LOGIN_URI = f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email&access_type=offline"
GOOGLE_TOKEN_URI = "https://accounts.google.com/o/oauth2/token"
GOOGLE_USER_INFO_URI = "https://www.googleapis.com/oauth2/v1/userinfo"


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


class Authentication:
    """
    Auth class
    """

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
    def authenticate_user(data):
        """
        User authentication
        """
        try:
            user_data = database.get_data("users", data["login"])
            if user_data["password"] == data["password"] and data["password"].strip():
                return user_data["login"]
            elif "@" in data["login"]:
                return user_data["login"]
            else:
                return None
        except ValueError:
            if "@" in data["login"]:
                database.add_data(
                    "users",
                    {
                        "login": data["login"],
                        "password": "",
                        "can_rent": True,
                        "group": 1,
                        "display_name": data["name"],
                    },
                )
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
