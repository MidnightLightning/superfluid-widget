import { Stack, TextField, Typography } from "@mui/material";
import { FC } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import InputWrapper from "../form/InputWrapper";
import ImageSelect from "../image-select/ImageSelect";
import { WidgetProps } from "../widget-preview/WidgetPreview";

const ProductEditor: FC = () => {
  const { control, watch } = useFormContext<WidgetProps>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "paymentDetails.paymentOptions", // unique name for your Field Array
  });

  const [paymentOptions] = watch(["paymentDetails.paymentOptions"]);

  return (
    <Stack gap={1}>
      <Stack mb={4} gap={2}>
        <Typography variant="subtitle1">Payment Configuration</Typography>

        <Controller
          control={control}
          name="productDetails.name"
          render={({ field: { value, onChange } }) => (
            <InputWrapper title="Product Name">
              {(id) => (
                <TextField
                  id={id}
                  placeholder=""
                  data-testid="product-name-field"
                  value={value}
                  onChange={onChange}
                />
              )}
            </InputWrapper>
          )}
        />

        <Controller
          control={control}
          name="productDetails.description"
          render={({ field: { value, onChange } }) => (
            <InputWrapper title="Product Description">
              {(id) => (
                <TextField
                  id={id}
                  data-testid="product-description-field"
                  placeholder=""
                  multiline
                  minRows={4}
                  value={value}
                  onChange={onChange}
                />
              )}
            </InputWrapper>
          )}
        />

        <Controller
          control={control}
          name="productDetails.imageURI"
          render={({ field: { value, onChange } }) => (
            <ImageSelect
              label="Product Image"
              onClick={(file) => onChange(URL.createObjectURL(file))}
              onRemove={() => onChange("")}
              imageSrc={value}
            />
          )}
        />
      </Stack>
    </Stack>
  );
};

export default ProductEditor;
