import React, { useState } from 'react'

const SeoData = () => {
    const [sizes, setSizes] = useState([
        { size: "1L", stock: 0, selected: false },
        { size: "100g", stock: 0, selected: false },
      ]);
    
      const handleSizeChange = (index) => {
        const updatedSizes = [...sizes];
        updatedSizes[index].selected = !updatedSizes[index].selected;
        setSizes(updatedSizes);
      };
    
     
  return (
    <div className="panel">
        <form > 
        <div className="row g-3 mb-3">
            <label htmlFor="salePrice" className="col-md-2 col-form-label col-form-label-sm"> Category</label>
            <div className="col-md-10">
            <div className="form-control-sm p-0">
                    <select className="form-control form-control-sm">
                        <option value="1">select main category</option>
                        <option value="2">Dress</option>
                    </select>
                </div>            
            </div>
        </div>
        <div className='row g-3'>
            <label htmlFor="Title" className="col-md-2 col-form-label col-form-label-sm">Title</label>
            <div className="col-md-10">
                <input type="text" className="form-control form-control-sm" id="Title" placeholder='Title'/>
            </div>
        </div>
        <br/>
        <div className="row g-3 ">
            <label htmlFor="Description" className="col-md-2 col-form-label col-form-label-sm">Description</label>
            <div className="col-md-10">
                <textarea type="text" className="form-control form-control-sm" id="Description" placeholder='Description'/>
            </div>
        </div>
        <br/>
        <div className="row g-3 mb-3">
            <label htmlFor="salePrice" className="col-md-2 col-form-label col-form-label-sm">Images</label>
            <div className="col-md-10">
            <div className="form-control-sm p-0">
            <input type="file" className="form-control form-control-sm" id="image" placeholder='Images'/>
            </div>            
            </div>
        </div>
        <div className="row g-3 mb-3">
            <label htmlFor="salePrice" className="col-md-2 col-form-label col-form-label-sm">Price</label>
            <div className="col-md-6">
            <div className="form-control-sm p-0">
            <input type="number" className="form-control form-control-sm" id="regularPrice" placeholder='Price'/>
            </div>            
            </div>
            <div className="col-md-4">
            <input type="text" className="form-control form-control-sm" id="regularPrice" placeholder='Discount'/>
            </div>
        </div>
        <br/>
        <br/>
        <div className="row g-3 mb-3">
          <label className="col-md-2 col-form-label col-form-label-sm">L/G</label>
          <div className="col-md-10">
            {sizes.map((size, index) => (
              <div className="row mb-2">
                <div className="col-md-2">
                  <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`Course Includes ${index}`}
                      onChange={() => handleSizeChange(index)}
                    />
                    <label htmlFor='Course Includes' className="form-check-label">
                    {size.size} 
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </form>
    <br/>
    </div>
  )
}

export default SeoData