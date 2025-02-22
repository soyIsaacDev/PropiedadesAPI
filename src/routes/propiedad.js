const server = require("express").Router();
const express = require("express");
const path = require('path');
const {literal} = require ('sequelize');

var public = path.join(__dirname,'../../uploads');

const { Propiedad, ImgPropiedad, AmenidadesDesarrollo,TipodePropiedad,TipoOperacion, Estado, Municipio, Ciudad, 
  Colonia, Cliente, Favoritos, AmenidadesDesarrolloPropiedad, ModeloAsociadoPropiedad, ImgModeloAsociado,
  Organizacion, TipodeOrganizacion,
  
} = require("../db");
const organizacion = require("../models/organizacion");

server.get("/getDataandImagenPropiedades", async (req, res) => {
  try {
    console.log("GET DATA PROPS")
    const dataPropiedad = await Propiedad.findAll({
      where:{publicada:"Si"},
      order: [
        ['precioMin','DESC']
      ],
      include: [
        {
          model: Organizacion,
          include: [
            {
              model: TipodeOrganizacion
            }
          ]
        },
        {
          model: ImgPropiedad,
          attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
          separate:true,
          order: [
            ['orden','ASC']
          ],
        },       
        {
          model: AmenidadesDesarrollo,
          through: {
            attributes: []
          }
        },
        {
          model: TipodePropiedad
        },
        {
          model: TipoOperacion
        },
        {
          model: Ciudad
        },
        {
          model: Municipio
        },
        {
          model: Estado
        },
        {
          model: Colonia
        },
      ]
    },);
    /* const cuentaProps = await Propiedad.count(
      {
        where:{publicada:"Si"}, 
        attributes: ['publicada','OrganizacionId'], 
        group:['publicada','OrganizacionId'] 
    });
    const FiltroProps = dataPropiedad.filter() */
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    
  } catch (e) {
    res.send(e);
  } 
}
);

server.get("/getPropiedadNombre/:userId", async (req, res) => {
  try {
    const {userId} = req.params;
    const cliente = await Cliente.findOne({
      where:{userId:userId}
    });
    const dataPropiedad = await Propiedad.findAll({
      where:{OrganizacionId:cliente.OrganizacionId},
      attributes: ['id', 'nombreDesarrollo', 'posicion', 'TipodePropiedadId'],
      
    });
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    
  } catch (e) {
    res.send(e);
  } 
}
);

/*    REQ QUERY

server.get("/detallespropiedad", async (req, res) => {
  try {
    const {id} = req.query 
  In Browser   /detallespropiedad/?id=2
*/

server.get("/detallespropiedad/:id", async (req, res) => {
  try {
    const {id} = req.params;
    console.log("Buscando Detalles" + id);
    const dataPropiedad = await Propiedad.findOne({
      where:{id:id},
      order: [
        [ImgPropiedad,'orden','ASC']
      ],
      include: [
        {
          model: ImgPropiedad,
          attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
        },
        {
          model: AmenidadesDesarrollo,
          through: {
            attributes: []
          }
        },
        {
          model: TipodePropiedad
        },
        {
          model: TipoOperacion
        },
        {
          model: Ciudad
        },
        {
          model: Municipio
        },
        {
          model: Estado
        },
        {
          model: Colonia
        },
      ]
    })
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontro la propiedad"});
  } catch (e) {
    res.send(e);
  }
});

function isAuthenticated (req, res, next) {
  console.log("77 En IS AUTH " +req.session.passport)
  if (req.session.passport.user) {
    console.log("79 SI ESTA Authenticado ")
    next()}
  else next('route')
}

server.get("/propiedadesconfavoritos/:userId",  async (req, res) => {
  try {
      let {userId} = req.params;

      const cliente = await Cliente.findOne({
        where: {
            userId
          }
      });

      const AllPropiedades = await Propiedad.findAll({
          include: [
            {
              model: ImgPropiedad,
              attributes: ['img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
            }
          ]
      },);
      
      const AllModelos = await ModeloAsociadoPropiedad.findAll({
        order: [
          ['precio"','ASC']
        ],
        include: [
          {
            model: ImgModeloAsociado,
            attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
            separate:true,
            order: [
              ['orden','ASC']
            ],
          }, 
        ]
      },);

      const Fav = await Favoritos.findAll({
          where: {
              ClienteId:cliente.id
            }
      });
      
      const AllPropandFav = [];
      const AllPropCopy = JSON.parse(JSON.stringify(AllPropiedades));
      for (let i = 0; i < AllPropCopy.length; i++) {
          
          for (let x = 0; x < Fav.length; x++) {
              if(Fav[x].PropiedadId === AllPropCopy[i].id){
                AllPropCopy[i].favorita=1;
                 /* const PropandFav = {
                  id: AllPropiedades[i].id,
                  nombreDesarrollo:AllPropiedades[i].nombreDesarrollo,
                  precio: AllPropiedades[i].precio,
                  recamaras: AllPropiedades[i].recamaras,
                  baños: AllPropiedades[i].baños,
                  favorita: 1,
                  posicion:AllPropiedades[i].posicion,
                  ImgPropiedads: AllPropiedades[i].ImgPropiedads,
                  
                }  */
                AllPropandFav.push(AllPropCopy[i]);
              }
          }
      }
      res.json(AllPropCopy);
  } catch (e) {
      res.send(e)
  }
});

server.get("/getAmenidadesDesarrolloSeleccionado/:id", async (req, res) => {
  try {
    const {id} = req.params;
    console.log("Buscando Amenidades" + id);
    const amenidades = await AmenidadesDesarrolloPropiedad.findAll({
      where:{PropiedadId:id},
      attributes: ["PropiedadId", "AmenidadesDesarrolloId"],
    });
    /* const dataPropiedad = await Propiedad.findOne({
      where:{id:id},
      attributes: ["id", "nombreDesarrollo"],
      include: [
        {
          model: AmenidadesDesarrollo,
          through: {
            attributes: []
          }
        },
        
      ]
    }) */
    amenidades? res.json(amenidades) : res.json({Mensaje:"No se encontro la propiedad"});
  } catch (e) {
    res.send(e);
  }
})

server.get("/seedRefId", async (req, res) => {
  try {
    const Desarrollo = await Propiedad.findAll();
    for (let i = 0; i < Desarrollo.length; i++) {
      Desarrollo[i].ref_id = literal('uuid_generate_v4()'); 
      await Desarrollo[i].save();
    }
    res.json(Desarrollo)
  } catch (e) {
    res.send(e)
  }
});

server.get("/actualizar/:propId/:orgId", async (req, res) =>{
  try {
    const {propId, orgId} = req.params
    const propiedad = await Propiedad.findOne({
      where:{id:propId},
    })
    /* propiedad.OrganizacionId="e29c1eae-6bc4-4e18-9799-995e8ab00994"
    await propiedad.save(); */
    await propiedad.update({OrganizacionId:orgId})
    res.send(propiedad)
  } catch (error) {
    res.send(error)
  }
})

server.get("/actualizarPublicacion", async (req, res) =>{
  try {
    const propiedad = await Propiedad.findAll();
    for (let i = 0; i < propiedad.length; i++) {
      await propiedad[i].update({publicada:"Si"})
    }
    res.send(propiedad)
  } catch (error) {
    res.send(error)
  }
})

server.get("/getPropOrganizacion/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cliente = await Cliente.findOne({where:{userId}})
    const dataPropiedad = await Propiedad.findAll({
      where:{ OrganizacionId:cliente.OrganizacionId },
      order: [
        ['precioMin','ASC']
      ],
      include: [
        {
          model: ImgPropiedad,
          attributes: ['id','orden','img_name','thumbnail_img','detalles_imgGde','detalles_imgChica'],
          separate:true,
          order: [
            ['orden','ASC']
          ],
        },       
        {
          model: AmenidadesDesarrollo,
          through: {
            attributes: []
          }
        },
        {
          model: TipodePropiedad
        },
        {
          model: TipoOperacion
        },
        {
          model: Ciudad
        },
        {
          model: Municipio
        },
        {
          model: Estado
        },
        {
          model: Colonia
        },
      ]
    },);
    
    dataPropiedad? res.json(dataPropiedad) : res.json({Mensaje:"No se encontraron datos de propiedades"});
    
  } catch (e) {
    res.send(e);
  } 
});

server.get("/cuentaxOrg", async (req, res) => {
  try {

     const dataPropiedad = await Propiedad.findAll({
      where:{publicada:"Si"},
      include: [
        {
          model: Organizacion,
          include: [
            {
              model: TipodeOrganizacion
            }
          ]
        },
      ]
      
    })
    /*const maxVentas = org[0].TipodeOrganizacion.cantidadPropVenta;
    const propOrgId = prop.OrganizacionId
    const cuentadeVentas = prop.TipoOperacionId;
    const cuentaPropiedades = [];
    const cuentas = {
      org:"",
      cuentadeVentas:"",
      cuentadeRentas:"",
    }
    const dataPropAmpliada = [];
    for (let i = 0; i < dataPropiedad.length; i++) {
     
      //venta
      if(dataPropiedad.TipoOperacionId===1){
        cuentas.org = dataPropiedad.OrganizacionId;
        cuentas.cuentadeVentas = +1
      }
      if(dataPropiedad.TipoOperacionId===3){
        cuentas.org = dataPropiedad.OrganizacionId;
        cuentas.cuentadeRentas = +1
      }      
    } */
    

    /* const cuentaProps = await Propiedad.count(
      {
        where:{publicada:"Si"}, 
        attributes: ['publicada','OrganizacionId'], 
        group:['publicada','OrganizacionId'] 
    }); */
    /* const OrgConMasProps = [];
    for (let i = 0; i < cuentaProps.length; i++) {
      if(cuentaProps[i].count>2){
        OrgConMasProps.push(cuentaProps[i].OrganizacionId)
      }
    } */
    
    /* const org = await Organizacion.findAll({
      include:  TipodeOrganizacion
    })
    
    
    

    const orgConPublicacionesdeMas = [];
    for (let i = 0; i < cuentaProps.length; i++) {
      for (let x = 0; x < org.length; x++) {
        const publicacionesdeMas = {
          organizacion:org[x].id,
          venta:"",
          renta:""
        }
        if(cuentaProps[i].OrganizacionId === org[x].id){
          if(cuentaProps[i].count > org[0].TipodeOrganizacion.cantidadPropVenta){ 
            publicacionesdeMas.venta = org[0].TipodeOrganizacion.cantidadPropVenta - cuentaProps[i].count;
          }
          if(cuentaProps[i].count > org[0].TipodeOrganizacion.cantidadPropRenta){
            publicacionesdeMas.renta = org[0].TipodeOrganizacion.cantidadPropRenta - cuentaProps[i].count;
          }
          // Si hay rentas o ventas de mas se manda al array
          if(publicacionesdeMas.venta || publicacionesdeMas.renta){
            orgConPublicacionesdeMas.push(publicacionesdeMas);
          }
        }
        
      }
    } */
    res.send(dataPropiedad )
  }
  catch(error){
    res.send(error)
  }
})

server.get("/orgyTipo", async (req, res) => {
  try {
    const org = await Organizacion.findAll({
      include:  TipodeOrganizacion
    })
    
    res.send(org)
  }
  catch(error){
    res.send(error)
  }
})

// Para ver las imagenes
server.use('/imagenes', express.static(public));

module.exports =  server;