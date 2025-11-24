import './ViewControls.css';

export function ViewControls() {
  return (
    <div className="view-controls-bar">
      <button className="view-control-btn active" title="Show workplanes">
        <img src="https://www.figma.com/api/mcp/asset/14adabdd-7dee-4fb6-9da3-76839e3445b8" alt="" className="icon-img" />
      </button>

      <button className="view-control-btn" title="Show normals">
        <img src="https://www.figma.com/api/mcp/asset/0ae7328d-18dd-45a8-af44-174a2676fce0" alt="" className="icon-img" />
      </button>

      <button className="view-control-btn" title="Show points">
        <img src="https://www.figma.com/api/mcp/asset/4ad0ba34-e78e-4d61-ac30-4f1ae494fc67" alt="" className="icon-img" />
      </button>

      <button className="view-control-btn" title="Toggle construction">
        <img src="https://www.figma.com/api/mcp/asset/64415620-02f9-4079-b15e-07e9646c2263" alt="" className="icon-img" />
      </button>

      <button className="view-control-btn" title="Show constraints">
        <img src="https://www.figma.com/api/mcp/asset/98a5d456-1b91-4a45-843d-71020aadc707" alt="" className="icon-img" />
      </button>

      <button className="view-control-btn" title="Wireframe view">
        <img src="https://www.figma.com/api/mcp/asset/d9f3fe48-6517-4908-a282-8b24100b6083" alt="" className="icon-img" />
      </button>

      <button className="view-control-btn" title="Shaded view">
        <img src="https://www.figma.com/api/mcp/asset/eca26fd9-ca80-4770-8c0f-b8c6798195c5" alt="" className="icon-img" />
      </button>

      <button className="view-control-btn" title="Solid view">
        <img src="https://www.figma.com/api/mcp/asset/c211062a-7b85-4a7a-8aad-99592c236d90" alt="" className="icon-img" />
      </button>

      <button className="view-control-btn" title="Show edges">
        <img src="https://www.figma.com/api/mcp/asset/dedea1cc-a868-46eb-a29d-2cd08424f795" alt="" className="icon-img" />
      </button>

      <button className="view-control-btn" title="Triangle mesh">
        <img src="https://www.figma.com/api/mcp/asset/0a4be227-a567-4521-bec2-a8739d03f21d" alt="" className="icon-img" />
      </button>

      <button className="view-control-btn" title="Occluded lines">
        <img src="https://www.figma.com/api/mcp/asset/5c82fade-78da-40e6-ba6e-e9e0e5f043df" alt="" className="icon-img" />
      </button>
    </div>
  );
}
