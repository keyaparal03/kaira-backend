export const getProfile =
async (
  req: any,
  res: any
) => {

  try {

    res.status(200).json({

      success: true,

      data: {

        id:
          req.user._id,

        name:
          req.user.name,

        email:
          req.user.email,

        role:
          req.user.role,

        createdAt:
          req.user.createdAt
      }
    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch profile"
    });
  }
};