const layerTop = () => {
  return `<div style="position: absolute; top: 0; width: 100%;">
        <img src="http://cdn.mcauto-images-production.sendgrid.net/54e79f65f13a4fe3/6f303a33-f59e-4acd-a30b-6f49c0a333be/1369x427.png" alt="" style="width: 100%; height: 150px; transform: rotateX(180deg); position: absolute; top:0; z-index:-1;"/>
        <img src="http://cdn.mcauto-images-production.sendgrid.net/54e79f65f13a4fe3/be69b44b-4f96-4601-8867-e3382d6cd70a/890x250.png" alt="" style="width: 100px; position: absolute; top: 30px; right: 5px; z-index:1;"/>
          </div>`;
};

const layerBottom = () => {
  return `<div style="position: absolute; bottom: 0; width:100%;">
    <img src="http://cdn.mcauto-images-production.sendgrid.net/54e79f65f13a4fe3/6f303a33-f59e-4acd-a30b-6f49c0a333be/1369x427.png" alt="" style="width: 100%; height: 150px; transform: rotateY(180deg); position: absolute; bottom:0; z-index:-1;"/>
    <img src="http://cdn.mcauto-images-production.sendgrid.net/54e79f65f13a4fe3/8c6460dc-b59b-4e94-b208-38d609ea3dd6/200x200.png" alt="" style="width: 75px; height:75px; border-radius: 50%; position: absolute; bottom: 10px; left: 20px;"/>
     </div>`;
};

module.exports = { layerTop, layerBottom };
