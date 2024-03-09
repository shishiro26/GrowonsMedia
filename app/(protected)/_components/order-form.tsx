"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OrderSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type FormValues = z.infer<typeof OrderSchema>;

const OrderForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(OrderSchema),
    mode: "onBlur",
    defaultValues: {
      productName: "",
      quantity: 0,
      products: [],
    },
  });

  const { fields, append } = useFieldArray({
    name: "products",
    control: form.control,
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col lg:flex-row md:justify-between gap-2">
      <Form {...form}>
        <form
          action=""
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-[100%] md:w-[50%]"
        >
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <SelectContent>
                    <SelectItem value="fresh Leads">Fresh leads</SelectItem>
                    <SelectItem value="old Leads">Old leads</SelectItem>
                    <SelectItem value="fresh Female Leads">
                      Fresh female leads
                    </SelectItem>
                    <SelectItem value="apna app leads">
                      App apna leads
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="">
            {fields.map((item, index) => (
              <div key={item.id}>
                <div className="flex gap-x-3">
                  <FormField
                    control={form.control}
                    name={`products.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`products.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          <div>
            <FormField
              control={form.control}
              name="products"
              render={() => (
                <Button className="mb-2">
                  <div className="flex items-center gap-x-3 mt-2 mb-2">
                    <label
                      htmlFor="Products"
                      className={`text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline ${
                        form.formState.errors.products && "text-red-500"
                      }`}
                      tabIndex={0}
                      onClick={() => {
                        append({
                          name: "",
                          quantity: 0,
                        });
                      }}
                    >
                      Add Product
                    </label>
                  </div>
                </Button>
              )}
            />
          </div>
          <Button type="submit" className="!mt-0 w-full">
            Request Order
          </Button>
        </form>
      </Form>
      <div className="flex-1 ml-2">
        <p>Total amount:</p>
        <h1 className="font-bold text-2xl">₹ 0.00</h1>
        {fields.length > 0 && (
          <div className="flex flex-col">
            <h1 className="text-3xl mt-4 ml-2">Order List</h1>
            <div className="m-3">
              <div className="flex flex-col gap-y-2">
                <div className="flex gap-x-3">
                  <span className="w-1/2">Product Name</span>
                  <span className="w-1/2">Quantity</span>
                </div>
                {fields.map((item, index) => (
                  <div key={item.id} className="flex gap-x-3">
                    <span className="w-1/2">{item.name}</span>
                    <span className="w-1/2">{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
