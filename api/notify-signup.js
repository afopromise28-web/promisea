export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required"
      });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Unconventional Wisdom <notifications@unconventionalwisdom.online>",
        to: ["bukunmiiafolabi@gmail.com"],
        subject: "New User Signup - Unconventional Wisdom",
        html: `
          <h2>New User Signup</h2>
          <p>A new user has signed up on Unconventional Wisdom.</p>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>

          <p>Please log in to your admin panel to review and approve the user.</p>
        `
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      success: true,
      message: "Notification sent"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to send notification"
    });
  }
      }
