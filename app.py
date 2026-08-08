import mysql.connector
from flask import Flask, render_template, request, redirect

app = Flask(__name__)

# ---------------- MySQL Connection ----------------
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="740228#m",
    database="smart_waste"
)

cursor = db.cursor()

print("MySQL Connected Successfully!")

# ---------------- HOME ----------------
@app.route('/')
def home():
    return render_template("index.html")


# ---------------- USER TYPE ----------------
@app.route('/user_type')
def user_type():
    return render_template("user_type.html")


# ---------------- PUBLIC ----------------
@app.route('/public')
def public():
    return render_template("public.html")


# ---------------- WORKER ----------------
@app.route('/worker')
def worker():
    return render_template("worker_dashboard.html")


# ---------------- ADMIN ----------------
@app.route('/admin')
def admin():
    return render_template("admin_dashboard.html")


# ---------------- LOGIN ----------------
@app.route('/login', methods=['GET', 'POST'])
def login():

    if request.method == 'POST':

        email = request.form['email']
        password = request.form['password']

        sql = "SELECT * FROM users WHERE email=%s AND password=%s"
        values = (email, password)

        cursor.execute(sql, values)
        user = cursor.fetchone()

        if user:
            return redirect('/public_dashboard')
        else:
            return "Invalid Email or Password"

    return render_template("login.html")


# ---------------- REGISTER ----------------
@app.route('/register', methods=['GET', 'POST'])
def register():

    if request.method == 'POST':

        fullname = request.form['fullname']
        email = request.form['email']
        password = request.form['password']

        sql = "INSERT INTO users (fullname, email, password) VALUES (%s, %s, %s)"
        values = (fullname, email, password)

        cursor.execute(sql, values)
        db.commit()

        return render_template("register_success.html")

    return render_template("register.html")


# ---------------- PUBLIC DASHBOARD ----------------
@app.route('/public_dashboard')
def public_dashboard():
    return render_template("public_dashboard.html")


# ---------------- LOGOUT ----------------
@app.route('/logout')
def logout():
    return redirect('/user_type')


# ---------------- RUN APP ----------------
if __name__ == "__main__":
    app.run(debug=True)