import admin from "firebase-admin"

const email = "zilma@app.com"
const password = "maria124"

if (!process.env.FIREBASE_PROJECT_ID) {
  console.error("Set FIREBASE_PROJECT_ID")
  process.exit(1)
}

admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credential: admin.credential.applicationDefault()
})

const auth = admin.auth()
try {
  const existing = await auth.getUserByEmail(email)
  console.log("User exists", existing.uid)
  process.exit(0)
} catch {}

const user = await auth.createUser({ email, password, emailVerified: true, disabled: false })
console.log("User created", user.uid)
