"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analysisFormSchema } from "@/lib/schemas";
import { AnalysisFormValues } from "@/lib/types";
import useSWR from "swr";
import { getAllPatients } from "@/lib/data-access/patient";
import { useState } from "react";
import { toast } from "sonner";
import { createAnalysis } from "@/lib/data-access/analysis";

export default function FileUpload({ token }: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const form = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisFormSchema),
    defaultValues: {
      patientId: "",
      patientName: "",
      email: "",
      diuretic: "" as unknown as number,
    },
  });

  const { data: patients } = useSWR("/patient", getAllPatients);

  const patientId = form.watch("patientId");
  const patientName = form.watch("patientName");

  const handleUpload = async (data: AnalysisFormValues) => {
    setIsLoading(true);
    toast.promise(createAnalysis(data, token), {
      loading: "Creating report...",
      success: (data) => {
        setIsLoading(false);
        router.push(`/analysis/${data.id}`);
        return "Report created successfully";
      },
      error: (error) => {
        setIsLoading(false);
        return `An error occurred: ${error.message}`;
      },
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <Tabs defaultValue="existing" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existing">Existing patient</TabsTrigger>
          <TabsTrigger value="new">New patient</TabsTrigger>
        </TabsList>
        <Card className="mt-2">
          <CardHeader>
            <CardTitle>Create new report</CardTitle>
            <CardDescription>
              Create a report on a new or existing patient.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpload)}
                className="flex flex-col gap-8"
              >
                <TabsContent value="existing">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Patient</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!!patientName}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a patient to create the report for" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {patients?.data?.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id}>
                                  {patient.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {patientName && (
                            <FormDescription>
                              Cannot select patient when trying to create a new
                              one. Remove the name in the &#34;New patient&#34;
                              tab.
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </TabsContent>
                <TabsContent className="space-y-8" value="new">
                  <FormField
                    control={form.control}
                    name="patientName"
                    disabled={!!patientId}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Wendy Adams"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          {patientId && (
                            <FormDescription>
                              Cannot create patient when patient is already
                              selected. Refresh the page to reset.
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    disabled={!!patientId}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel className="flex gap-1 items-center">
                            Email{" "}
                            <p className="text-xs text-muted-foreground">
                              (optional)
                            </p>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="email@example.com"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </TabsContent>

                <FormField
                  control={form.control}
                  name="dicomImages"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="flex gap-1 items-center">
                          Images{" "}
                          <p className="text-xs text-primary-brand">
                            (required)
                          </p>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="DICOM images"
                            type="file"
                            accept="application/dicom"
                            onChange={(e) => {
                              const file = e.target.files?.item(0);
                              if (file) {
                                field.onChange(file);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="diuretic"
                  render={({ field: { value, onChange, ...field } }) => {
                    return (
                      <FormItem>
                        <FormLabel className="flex gap-1 items-center">
                          Time of diuretic{" "}
                          <p className="text-xs text-primary-brand">
                            (required)
                          </p>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="20"
                            type="number"
                            value={value || ""}
                            onChange={(e) =>
                              onChange(
                                e.target.value ? Number(e.target.value) : "",
                              )
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <Button
                  className="mt-8 w-full"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">Uploading</span>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
