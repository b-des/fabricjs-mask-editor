import React, {useEffect, useState} from "react";
import {fabric} from 'fabric';
import {FabricJSCanvas, useFabricJSEditor} from "fabricjs-react";
import shapes from './shapes';
import polygonUtil from './polygon';
import {removeShapes, clearCanvasAndLeaveOnlyShape, transformCoords} from './utils';
import './App.css';
import {
    Button,
    ButtonGroup,
    FormInput,
    InputGroup,
    Card,
    CardHeader,
    Form,
    CardBody,
    CardFooter,
} from "shards-react";
import "shards-ui/dist/css/shards.min.css";
import {
    FaCircle,
    FaDrawPolygon,
    FaImage,
    FaPlus,
    FaSave,
    FaSquare,
    FaTrash
} from 'react-icons/fa';

import {BsFillTriangleFill} from 'react-icons/bs'

import {
    BACKGROUND_ID,
    CIRCLE, DEFAULT_SHAPE_FEATURES,
    INITIAL_CANVAS_BG,
    LOADED_PRODUCT_CANVAS_BG,
    POLYGON,
    RECTANGLE,
    TRIANGLE
} from "./constants";


//let isInitialized = false;
let zoom = 1;
//let background = null;

const CONTAINER_WIDTH = 300;
const CONTAINER_HEIGHT = 300;

function Side(props) {
    let {editor, onReady} = useFabricJSEditor();
    let [background, setBackground] = useState(null);
    let savedData = props.data;
    let image = props.image;

    const ready = (canvas) => {
        onReady(canvas);

        if (canvas) {
            canvas.setWidth(CONTAINER_WIDTH);
            canvas.setHeight(CONTAINER_HEIGHT);
            canvas.setBackgroundColor(INITIAL_CANVAS_BG);

            canvas.on('object:moving', polygonUtil(canvas).onObjectMove);
            canvas.on('mouse:down', polygonUtil(canvas).onMouseDown);
            canvas.on('mouse:move', polygonUtil(canvas).onMouseMove);

            if (savedData) {
                drawSavedData(canvas);
            }

        }
    }

    const transformSavedData = (data) => {
        let scale = 1 / data.scaleFactor;
        data.objects.map(object => transformCoords(object, scale));
        return data;
    }

    const onGetData = () => {
        clearCanvasAndLeaveOnlyShape(editor.canvas);

        let canvasObjects = editor.canvas.getObjects();
        let scale = background.width / editor.canvas.getWidth();
        // editor.canvas.setZoom(scale);
        //editor.canvas.setWidth(background.width);
        //editor.canvas.setHeight(background.height);

        let bound = canvasObjects[0].getBoundingRect();
        editor.canvas.renderAll();
        editor.canvas.contextContainer.strokeRect(
            bound.left + 0.5,
            bound.top + 0.5,
            bound.width,
            bound.height
        );


        let json = editor.canvas.toJSON();
        let objects = json.objects;

        objects[0] = transformCoords(objects[0], scale);
        objects[0].fill = 'white';
        objects[0].stroke = 'white';
        objects[0].opacity = 1;

        json.objects = objects;
        delete json.background;
        delete json.backgroundImage;
        json.scaleFactor = scale;
        props.onSave(JSON.stringify(json));
    };


    function loadProductImage(url, canvas) {
        canvas = canvas ? canvas : editor.canvas;

        fabric.Image.fromURL(url, function (image) {

            //editor.canvas.setBackgroundColor('#ccc');

            // width is bigger than height or equal
            if (image.width / image.height >= 1) {
                zoom = CONTAINER_WIDTH / image.width;
            } else { // height is bigger than width
                zoom = CONTAINER_HEIGHT / image.height;
            }

            //editor.canvas.setZoom(zoom);
            canvas.setWidth(image.width * zoom);
            canvas.setHeight(image.height * zoom);

            image.selectable = false;
            image.id = BACKGROUND_ID;
            canvas.setBackgroundColor(LOADED_PRODUCT_CANVAS_BG);
            canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / image.width,
                scaleY: canvas.height / image.height
            });
            setBackground(image);
        });
    }

    const drawShape = (shape) => {
        switch (shape) {
            case TRIANGLE:
                shapes(editor.canvas).drawTriangle();
                break;
            case RECTANGLE:
                shapes(editor.canvas).drawRectangle();
                break;
            case CIRCLE:
                shapes(editor.canvas).drawCircle();
                break;
            case POLYGON:
                shapes(editor.canvas).drawPolygon();
                break;
            default:
                removeShapes(editor.canvas)
        }
    }

    const toggleDrawPolygon = () => {
        polygonUtil(editor.canvas).toggleDrawPolygon()
    }

    const drawSavedData = (canvas) => {
        canvas.loadFromJSON(transformSavedData(savedData), () => {
            loadProductImage(image, canvas);
            canvas.renderAll();
            canvas.getObjects()[0].set({
                ...DEFAULT_SHAPE_FEATURES
            })
        });
    }

    const addSide = () => {
        props.onAddSide();
    }

    return (
        <div className="App">
            <Card style={{maxWidth: `${CONTAINER_WIDTH + 40}px`}}>
                <CardHeader>
                    <ButtonGroup size="sm">
                        <Button onClick={loadProductImage.bind(this, image, null)}><FaImage/></Button>
                        <Button onClick={drawShape.bind(this, CIRCLE)}><FaCircle/></Button>
                        <Button onClick={drawShape.bind(this, RECTANGLE)}><FaSquare/></Button>
                        <Button onClick={drawShape.bind(this, TRIANGLE)}><BsFillTriangleFill/></Button>
                        <Button onClick={toggleDrawPolygon}><FaDrawPolygon/></Button>
                        <Button onClick={drawShape.bind(this, null)} theme="danger"><FaTrash/></Button>
                        <Button onClick={onGetData} theme="info"><FaSave/></Button>
                        <Button onClick={addSide} theme="success"><FaPlus/></Button>
                    </ButtonGroup>
                </CardHeader>

                <CardBody style={{padding: '20px'}}>
                    <div style={{
                        'width': `${CONTAINER_WIDTH}px`,
                        'height': `${CONTAINER_HEIGHT}px`,
                        'margin': '0 auto'
                    }}>
                        <FabricJSCanvas className="sample-canvas" onReady={ready}/>
                    </div>
                </CardBody>
                <CardFooter style={{textAlign: 'center'}}>
                    <Form>
                        <InputGroup>
                            <FormInput id="username" style={{width: '100px'}} placeholder={'Название'}/>
                            <FormInput id="username" style={{width: '100px'}} placeholder={'Наценка'}/>
                        </InputGroup>
                    </Form>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Side;
