FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /code

# Copy the requirements file and install dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy your application code into the container
COPY . /code/

# Command to run your app with Gunicorn
# Hugging Face requires binding to 0.0.0.0 and port 7860
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "server:app"]