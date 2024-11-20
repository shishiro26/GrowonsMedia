"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormControl,
  FormMessage,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import * as z from "zod";
import { EditProductFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { editProduct } from "@/actions/products";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

type Product = {
  id: string;
  productName: string;
  description: string;
  price: number;
  minProduct: number;
  maxProduct: number;
  stock: number;
  sheetLink: string;
  sheetName: string;
} | null;

type ProductEditFormProps = {
  product: Product;
};

const ProductEditForm: React.FC<ProductEditFormProps> = ({ product }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof EditProductFormSchema>>({
    resolver: zodResolver(EditProductFormSchema),
    defaultValues: {
      id: product?.id,
      productName: product?.productName,
      price: product?.price,
      description: product?.description,
      minProduct: product?.minProduct,
      maxProduct: product?.maxProduct,
      stock: product?.stock,
      sheetLink: product?.sheetLink ,
      sheetName: product?.sheetName
    },
  });

  const onSubmit = (values: z.infer<typeof EditProductFormSchema>) => {
    setError("");
    startTransition(() => {
      editProduct(values).then((data) => {
        if (data.error) {
          setError(data.error);
        }

        if (data.success) {
          router.push("/admin/product/product-table");
        }
      });
    });
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full md:w-[50%]"
        >
          <div className="space-y-4 ">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Product Name"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Product Description"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily stock</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="minProduct"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Product</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxProduct"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Product</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sheetLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Sheets Link</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter Google Sheets link"
                        type="url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sheetName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sheet Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Enter Sheet Name"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormError message={error} />
          <Button type="submit" disabled={isPending} className="w-full">
            Edit Product
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductEditForm;
