from fastapi import Request, status, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import jwt
from db.db import DBOperations

database: dict()

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def set_db(db: DBOperations):
    """
    Set db
    """
    global database
    database=db
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
    def authenticate_user(name, password):
        """
        User authentication
        """
        try:
            user_data = database.get_data("users", name)
            if user_data["password"] == password:
                return user_data["login"]
            else:
                return None
        except ValueError:
            return None
    @staticmethod
    def get_current_user(request: Request):
        """
        Get current user
        """
        token = request.cookies.get("access_token")
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
