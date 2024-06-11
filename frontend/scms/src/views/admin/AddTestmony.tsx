import { useState } from "react";
import Button from "../../components/Button";
import axios from "axios";

interface TestimonyData {
  title: string;
  description: string;
  priority: string;
  speaker: string;
  poster: File | null;
  video: File | null;
}

const AddTestmony = () => {
  const [formData, setFormData] = useState<TestimonyData>({
    title: "",
    description: "",
    priority: "",
    speaker: "",
    poster: null,
    video: null,
  });

  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const clearSuccessMsg = () => {
    localStorage.removeItem("successMsg");
    setMsg("");
    setErrorMsg("");
  };

  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (name === "poster") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: file,
    }));
  };

  const clearInputs = () => {
    setFormData({
      title: "",
      description: "",
      priority: "",
      speaker: "",
      poster: null,
      video: null,
    });
    setImagePreview(null);

    const posterInput = document.querySelector(
      'input[name="poster"]'
    ) as HTMLInputElement;
    const videoInput = document.querySelector(
      'input[name="video"]'
    ) as HTMLInputElement;
    if (posterInput) posterInput.value = "";
    if (videoInput) videoInput.value = "";
  };

  const postTestimony = async () => {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("priority", formData.priority);
    form.append("speaker", formData.speaker);
    if (formData.poster) form.append("poster", formData.poster);
    if (formData.video) form.append("video", formData.video);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/testimonials/`,
        form,
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setMsg("Successfully posted testimony");
        clearInputs();
      }
    } catch (error) {
      setErrorMsg("Something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="">
      <div className="mt-3">
        <div className="flex-box pdg-ntb justify-content-center align-items-center gap-5">
          <div className="col-lg-8 border p-4 rounded">
            <h5 className="text-mutes">New testimony</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                postTestimony();
              }}
              method="post"
              encType="multipart/form-data"
              className="mt-4"
            >
              <div className="w-full">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  name="title"
                  className="w-full"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter title for this testimony"
                  required
                />
              </div>

              <div className="w-full mt-3">
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  className="w-full"
                  rows={10}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description for this testimony"
                  required
                ></textarea>
              </div>

              <div className="w-full mt-3">
                <label htmlFor="">Priority</label>
                <select
                  value={formData.priority}
                  name="priority"
                  className="w-full"
                  onChange={handleInputChange}
                >
                  <option value="">------------</option>
                  <option value="high">High</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="w-full mt-3">
                <label htmlFor="speaker">Speaker</label>
                <input
                  type="text"
                  name="speaker"
                  className="w-full"
                  value={formData.speaker}
                  onChange={handleInputChange}
                  placeholder="Enter speaker for this testimony"
                  required
                />
              </div>

              <div className="w-full d-flex gap-3 mt-3 border rounded px-3 pb-3 pt-2">
                <div>
                  <label htmlFor="poster">Poster</label>
                  <input
                    type="file"
                    name="poster"
                    className="w-full"
                    onChange={handleFileChange}
                    required
                  />
                  {imagePreview && typeof imagePreview === "string" && (
                    <div className="preview border mt-2">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="video">Video</label>
                  <input
                    type="file"
                    name="video"
                    className="w-full"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {msg && (
                <div
                  className="d-flex justify-content-between align-items-center alert alert-primary mt-1 mb-4 p-2 w-full"
                  role="alert"
                >
                  <p className="m-0 text-muted f-16 w-full">{msg}</p>
                  <button
                    className="px-3 secondary-btn"
                    onClick={clearSuccessMsg}
                  >
                    OK
                  </button>
                </div>
              )}

              {errorMsg && (
                <div
                  className="d-flex justify-content-between align-items-center alert alert-danger mt-1 mb-4 p-2 w-full"
                  role="alert"
                >
                  <p className="m-0 text-muted f-16 w-full">{errorMsg}</p>
                  <button
                    className="px-3 secondary-btn"
                    onClick={clearSuccessMsg}
                  >
                    OK
                  </button>
                </div>
              )}

              <div className="w-full d-flex gap-3 mt-4">
                <Button
                  text={"POST"}
                  type={"submit"}
                  color={""}
                  class={"primary-btn"}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTestmony;
