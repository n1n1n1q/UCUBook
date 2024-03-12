FROM python:3.11

WORKDIR /app

COPY src /app/src
COPY static /app/static
COPY templates /app/templates

COPY requirements.txt /app

RUN pip install -r requirements.txt

EXPOSE 8080
WORKDIR /app/

CMD ["python","src/main.py"]