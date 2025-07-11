
  
  {/* Level 1: Categories */}
  <div style={{marginBottom: '10px'}}>
    <h4>Categories</h4>
    <div style={{
      maxHeight: '150px',
      overflowY: 'auto',
      border: '1px solid #ddd',
      padding: '10px'
    }}>
      <FilterableSelectGroup ... />
    </div>
  </div>
  
  {/* Level 2: Subcategories */}
  <div style={{marginBottom: '10px'}}>
    <h4>Subcategories</h4>
    <div style={{
      maxHeight: '150px', 
      overflowY: 'auto',
      border: '1px solid #ddd',
      padding: '10px'
    }}>
      {/* New subcategory component goes here */}
    </div>
  </div>
  
  {/* Level 3: Fields */}
  <div style={{marginBottom: '10px'}}>
    <h4>Fields</h4>
    <div style={{
      maxHeight: '200px',
      overflowY: 'auto', 
      border: '1px solid #ddd',
      padding: '10px'
    }}>
      <CategoryFields ... />
    </div>
  </div>
</div>