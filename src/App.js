import React, { useState } from "react";
import axios from "axios";
import { Button, Table, DatePicker } from "antd";
import "antd/dist/reset.css";

const { RangePicker } = DatePicker;

function App() {
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [filtroFechas, setFiltroFechas] = useState(null);

    const cargarDatos = () => {
        setCargando(true);
        axios
            .get("https://catalogodatos.cnmc.es/dataset/390424ac-0064-4e42-bb76-b36a5903984c/resource/e7c35a34-2737-4e97-ae87-99692dcb2b39/download/ds_13601_1.json")
            .then((respuesta) => {
                setDatos(respuesta.data);
            })
            .catch((error) => {
                console.error("Error al obtener datos:", error);
            })
            .finally(() => {
                setCargando(false);
            });
    };

    const datosFiltrados = filtroFechas
        ? datos.filter((item) => {
              const fechaItem = new Date(item.fecha + "-01");
              return fechaItem >= filtroFechas[0].toDate() && fechaItem <= filtroFechas[1].toDate();
          })
        : datos;

    const columnas = [
        {
            title: "Fecha",
            dataIndex: "fecha",
            key: "fecha",
            sorter: (a, b) => a.fecha.localeCompare(b.fecha),
        },
        {
            title: "Precio sin impuestos",
            dataIndex: "precio_antes_de_impuestos",
            key: "precio_antes_de_impuestos",
            sorter: (a, b) => a.precio_antes_de_impuestos - b.precio_antes_de_impuestos,
        },
        {
            title: "IVA",
            dataIndex: "iva",
            key: "iva",
            sorter: (a, b) => a.iva - b.iva,
        },
        {
            title: "PVP",
            dataIndex: "precio_de_venta_al_publico",
            key: "precio_de_venta_al_publico",
            sorter: (a, b) => a.precio_de_venta_al_publico - b.precio_de_venta_al_publico,
        },
    ];

    return (
        <div className="App">
            <img src="/unir.svg" alt="Logo" width="200" />
            <h1>Actividad 3 - Mauricio Mendoza - Uso de una API en aplicación de componentes</h1>
            <p>Esta aplicacion consume datos de "Estadística GLP - Precio GLP envasado regulado", que pueden encontrarse en:</p>
            <p>
                <a href="https://catalogodatos.cnmc.es/dataset/390424ac-0064-4e42-bb76-b36a5903984c/resource/e7c35a34-2737-4e97-ae87-99692dcb2b39/download/ds_13601_1.json">Catalogo de datos</a>
            </p>
            <Button type="primary" onClick={cargarDatos} loading={cargando}>
                {cargando ? "Cargando..." : "Cargar datos"}
            </Button>
            <Button danger onClick={() => setDatos([])} loading={cargando}>
                Limpiar datos
            </Button>

            <RangePicker picker="month" format="YYYY-MM" style={{ marginLeft: 20 }} onChange={(fechas) => setFiltroFechas(fechas)} />

            <div style={{ marginTop: 20 }}>
                <Table dataSource={datosFiltrados} columns={columnas} rowKey={(record, index) => index} pagination={true} loading={cargando} />
            </div>
        </div>
    );
}

export default App;
