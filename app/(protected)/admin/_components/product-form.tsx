"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ProductSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/shared/form-error";
import { addProduct } from "@/actions/products";
import { toast } from "sonner";

const ProductForm = ({ userId }: { userId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      userId: userId,
      productName: "",
      price: 0,
      description: "",
      minProduct: 0,
      maxProduct: 1,
      stock: 0,
      sheetLink: "",
      sheetName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ProductSchema>) => {
    setError("");
    startTransition(() => {
      addProduct(values).then((data) => {
        if (data?.success) {
          toast.success(data.success);
          form.reset();
        }
        if (data?.error) {
          setError(data.error);
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
                    <FormLabel>Sheets Link</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Google Sheets Link"
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
                        placeholder="Sheet Name"
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
            Add Product
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductForm;
