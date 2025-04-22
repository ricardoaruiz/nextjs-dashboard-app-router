"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { z } from "zod";
const sql = postgres(process.env.POSTRESS_URL!, { ssl: "require" });

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

/**
 * Creates an invoice in the database.
 * @param formData The form data to create the invoice with
 * @remarks This function is used in the /dashboard/invoices/create route.
 * It validates the form data using the CreateInvoice schema,
 * converts the amount to cents, and then creates the invoice in the database.
 * After creating the invoice, it revalidates the /dashboard/invoices page
 * and redirects the user back to that page.
 */
export async function createInvoice(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const { customerId, amount, status } = CreateInvoice.parse(data);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  const invoice = {
    customerId,
    amount: amountInCents,
    status,
    date,
  };

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${invoice.customerId}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

/**
 * Updates an invoice in the database.
 * @param id The ID of the invoice to update
 * @param formData The form data to update the invoice with
 * @remarks This function is used in the /dashboard/invoices/[id]/edit route.
 * It validates the form data using the UpdateInvoice schema,
 * converts the amount to cents, and then updates the invoice in the database.
 * After updating the invoice, it revalidates the /dashboard/invoices page
 * and redirects the user back to that page.
 */
export async function updateInvoice(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const { customerId, amount, status } = UpdateInvoice.parse(data);
  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

/**
 * Deletes an invoice from the database.
 * @param id The ID of the invoice to delete
 * @remarks This function is used in the /dashboard/invoices/[id] route.
 * It deletes the invoice with the given ID from the database,
 * revalidates the /dashboard/invoices page,
 * and redirects the user back to that page.
 */
export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}
