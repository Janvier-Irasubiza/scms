import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface OppData {
  title: string;
  description: string;
  speaker: string;
  priority: string;
  poster: File | null;
}

const ReviewOpportunity = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [data, setData] = useState<OppData>({
    title: "",
    description: "",
    speaker: "",
    priority: "",
    poster: null,
  });

  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/opp/${id}`)
      .then((response) => {
        setData(response.data);
        setImagePreview(response.data.poster);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const clearSuccessMsg = () => {
    localStorage.removeItem("successMsg");
    setMsg("");
    setErrorMsg("");
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) {
      setData((prevData) => ({
        ...prevData,
        [name]: null,
      }));
      setImagePreview(null);
      return;
    }

    const file = files[0];
    if (name === "poster") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

    setData((prevData) => ({
      ...prevData,
      [name]: file,
    }));
  };

  const editOpp = async () => {
    const form = new FormData();
    form.append("title", data.title);
    form.append("description", data.description);
    form.append("priority", data.priority);

    const posterInput = document.querySelector(
      'input[name="poster"]'
    ) as HTMLInputElement;

    if (posterInput && posterInput.files && posterInput.files.length > 0) {
      const posterFile = posterInput.files[0];
      form.append("poster", posterFile);
    }

    try {
      if (id) {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/opp/${id}`,
          form,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201 || response.status === 200) {
          setMsg("Successfully updated opportunity");
        }
      }
    } catch (error) {
      setErrorMsg("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="">
      <div className="mt-3">
        <div className="flex-box pdg-ntb justify-content-center align-items-center gap-5">
          <div className="col-lg-8 border p-4 rounded">
            <h5 className="text-mutes">{data.title}</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editOpp();
              }}
              method="post"
              className="mt-4"
              encType="multipart/form-data"
            >
              <div className="w-full">
                <label htmlFor="">Title</label>
                <input
                  type="text"
                  defaultValue={data.title}
                  name="title"
                  className="w-full"
                  placeholder="Enter title for this opportunity"
                  onChange={handleInputChange}
                />
              </div>

              <div className="w-full mt-3">
                <label htmlFor="">Description</label>
                <textarea
                  name="description"
                  value={data.description}
                  className="w-full"
                  rows={10}
                  placeholder="Enter description for this opportunity"
                  onChange={handleInputChange}
                />
              </div>

              <div className="w-full mt-3">
                <label htmlFor="">Priority</label>
                <select
                  value={data.priority}
                  name="priority"
                  className="w-full"
                  onChange={handleInputChange}
                >
                  <option value="">------------</option>
                  <option value="high">High</option>
                  <option value="general">General</option>
                </select>
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
                <button type="submit" className={"primary-btn px-3"}>
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOpportunity;
