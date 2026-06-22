import Contact
from "../models/Contact";

export const sendContact =
async (
  req: any,
  res: any
) => {

  try {

    const {
      name,
      email,
      phone,
      message
    } = req.body;

    const inquiry =
      await Contact.create({

        name,
        email,
        phone,
        message
      });

    res.status(201).json({

      success: true,

      message:
        "Message sent successfully",

      data: inquiry
    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        "Failed to send message"
    });
  }
};