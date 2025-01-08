import React, { useCallback, useState } from "react";
import apiConfig from "../../../../../config/apiConfig";

const SubCategoryForm = ({
  formData,
  categories,
  handleChange,
  handleSubmit,
  onFileChange,
  setSelectedFile,
}) => {
   const [preview, setPreview] = useState(null);
  
   const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl); // Set preview for new file
    } else {
      setPreview(null); // Clear preview if file is removed
      setSelectedFile(null); // Reset selected file
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-12">
          <div className="row">
         <div className="col-lg-6"> 
         <div className="">
              <label className="title-color" htmlFor="subCategoryName">
                Sub Category Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                id="subCategoryName"
                placeholder="New Sub Category"
              />
              <input type="hidden" name="hiddenField" value="someValue" />
              <input name="position" value="1" className="d-none" />
            </div>

            <div className="form-group">
              <label className="title-color" htmlFor="mainCategory">
                Main Category <span className="text-danger">*</span>
              </label>
              <select
                id="mainCategory"
                name="mainCategory"
                value={formData.mainCategory}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="" disabled>
                  Select main category
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group ">
              <label className="title-color" htmlFor="priority">
                Priority
              </label>
              <select
                className="form-control"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                id="priority"
                required
              >
                <option value="" disabled>
                  Set Priority
                </option>
                {Array.from({ length: 11 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="title-color">Sub Category Logo</label>
              <span className="text-info">
                <span className="text-danger">*</span> Ratio 1:1 (500 x 500 px)
              </span>
              <div className="custom-file text-left">
                <input
                  type="file"
                  name="logo"
                  id="category-image"
                  className="custom-file-input"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                />
                <label className="custom-file-label" htmlFor="category-image">
                  Choose File
                </label>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mt-4 mt-lg-0 from_part_2">
            <div className="form-group flex justify-center items-center">
              <div className="text-center flex justify-center items-center ">
           {
            console.log("formdata", formData)
           }
              <img
  className="upload-img-view"
  id="viewer"
  alt="Category Preview"
  src={
    preview || 
    (formData?.logo ? `${apiConfig.bucket}/${formData?.logo}` : "/image-place-holder.png")
  }
/>

              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 justify-content-end">
        <button
          type="reset"
          className="btn bg-secondary-500 border border-secondary-500"
        >
          Reset
        </button>
        <button
          type="submit"
          className="btn bg-primary-500 text-white hover:bg-primary-dark-500 hover:text-white"
          style={{
            color: "white",
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default SubCategoryForm;
