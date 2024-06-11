import { useState } from "react";
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import Button from "../../components/Button";

const OpportunityForm = () => {
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <form action="" method="post" className="mt-4">
      <div className="w-full">
        <label htmlFor="">Title</label>
        <TextInput
          name="title"
          class="w-full"
          placeholder="Enter title for this opportunity"
        />
      </div>

      <div className="w-full mt-3">
        <label htmlFor="">Description</label>
        <TextArea
          name="description"
          class="w-full"
          rows={10}
          placeholder="Enter description for this opportunity"
        />
      </div>

      <div className="w-full mt-3 border rounded px-3 pb-3 pt-2">
        <div>
          <label htmlFor="">Poster</label>
          <input
            type="file"
            name="poster"
            className="w-full"
            onChange={handleImageChange}
          />
          {imagePreview && typeof imagePreview === "string" && (
            <div className="preview border mt-2">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>
      </div>

      <div className="w-full d-flex gap-3 mt-4">
        <Button
          text={"POST"}
          type={"button"}
          color={""}
          class={"primary-btn"}
        />
      </div>
    </form>
  );
};

export default OpportunityForm;
