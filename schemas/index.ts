import * as z from "zod";

export const LoginSchema = z.object({
  username: z.string().min(10, {
    message: "Enter valid email or number",
  }),
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(4, {
      message: "Minimum of 4 characters required",
    }),
    email: z.string().email({
      message: "Email is required",
    }),
    number: z
      .string()
      .min(10, {
        message: "Phone number must be 10 characters",
      })
      .max(10, {
        message: "Phone number must be 10 characters",
      }),
    password: z.string({ required_error: "Password is required" }).min(6, {
      message: "Minimum of 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);

    const errors = [];

    if (!containsLowercase(password)) {
      errors.push(`Password must contain at least one lowercase letter.`);
    }

    if (!containsUppercase(password)) {
      errors.push(`Password must contain at least one uppercase letter.`);
    }

    if (!containsSpecialChar(password)) {
      errors.push(`Password must contain at least one special character.`);
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number.\n");
    }

    if (errors.length > 0) {
      checkPassComplexity.addIssue({
        code: "custom",
        path: ["password"],
        message: errors.join("\n"),
      });
    }
  });

export const MoneySchema = z.object({
  amount: z.string().min(1, {
    message: "Amount must be greater than 0",
  }),
  upiid: z.string(),
  accountNumber: z.string(),
  transactionId: z
    .string()
    .min(12, {
      message: "Transaction ID must be 12 characters",
    })
    .max(18, {
      message: "Transaction Id cant' exceed 18 characters",
    }),
  image: z
    .custom<FileList>()
    .transform((val) => {
      if (val instanceof File) return val;
      if (val instanceof FileList) return val[0];
      return null;
    })
    .superRefine((file, ctx) => {
      if (!(file instanceof File)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          fatal: true,
          message: "Not a file",
        });

        return z.NEVER;
      }

      if (file.size > 5 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max file size allowed is 5MB",
        });
      }

      if (
        !["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
          file.type
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File must be an image (jpeg, jpg, png, webp)",
        });
      }
    })
    .pipe(z.custom<File>()),
});

export const RejectInvoiceSchema = z.object({
  id: z.string(),
  reason: z.string().min(10, { message: "Minimum of 10 characters required" }),
});

export const OrderSchema = z.object({
  productName: z.string().min(1, { message: "Product is required!" }),
  quantity: z.coerce.number(),
  products: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Product Name is required" }),
        quantity  : z.coerce.number(),
      })
    )
    .nonempty({ message: "Product is required" }),
});

export const FeedbackSchema = z.object({
  orderId: z
    .string()
    .min(10, {
      message: "The Order Id must be at least 10 character long",
    })
    .max(10, {
      message: "OrderId must not exceed 10 characters long",
    }),
  comment: z.string().min(1, {
    message: "The Comment must be at least 10 character long",
  }),
});
