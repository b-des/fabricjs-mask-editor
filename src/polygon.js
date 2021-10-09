import {fabric} from "fabric";
import {actionHandler, anchorWrapper, getCurrentShape, removeShapes} from "./utils";
import {DEFAULT_SHAPE_FEATURES, POLYGON, SHAPE_ID} from "./constants";
import App from "./side";

let activeLine;
let activeShape;
let lineArray = [];
let pointArray = [];

export default function init(canvas) {


    function addPoint(options) {
        const pointOption = {
            id: new Date().getTime(),
            radius: 5,
            fill: '#ffffff',
            stroke: '#333333',
            strokeWidth: 0.5,
            left: options.e.layerX / canvas.getZoom(),
            top: options.e.layerY / canvas.getZoom(),
            selectable: false,
            hasBorders: false,
            hasControls: false,
            originX: 'center',
            originY: 'center',
            objectCaching: false,
        };
        const point = new fabric.Circle(pointOption);

        if (pointArray.length === 0) {
            // fill first point with red color
            point.set({
                fill: 'red'
            });
        }

        const linePoints = [
            options.e.layerX / canvas.getZoom(),
            options.e.layerY / canvas.getZoom(),
            options.e.layerX / canvas.getZoom(),
            options.e.layerY / canvas.getZoom(),
        ];
        const lineOption = {
            strokeWidth: 2,
            fill: '#999999',
            stroke: '#999999',
            originX: 'center',
            originY: 'center',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            objectCaching: false,
        };
        const line = new fabric.Line(linePoints, lineOption);
        line.class = 'line';

        if (activeShape) {
            const pos = canvas.getPointer(options.e);
            const points = activeShape.get('points');
            points.push({
                x: pos.x,
                y: pos.y
            });
            const polygon = new fabric.Polygon(points, {
                stroke: '#333333',
                strokeWidth: 1,
                fill: '#cccccc',
                opacity: 0.3,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
                objectCaching: false,
            });
            canvas.remove(activeShape);
            canvas.add(polygon);
            activeShape = polygon;
            canvas.renderAll();
        } else {
            const polyPoint = [{
                x: options.e.layerX / canvas.getZoom(),
                y: options.e.layerY / canvas.getZoom(),
            },];
            const polygon = new fabric.Polygon(polyPoint, {
                stroke: '#333333',
                strokeWidth: 1,
                fill: '#cccccc',
                opacity: 0.3,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
                objectCaching: false,
            });
            activeShape = polygon;
            canvas.add(polygon);
        }

        activeLine = line;
        pointArray.push(point);
        lineArray.push(line);

        canvas.add(line);
        canvas.add(point);
    }


    function generatePolygon(pointArray) {
        const points = [];
        // collect points and remove them from canvas
        for (const point of pointArray) {
            points.push({
                x: point.left,
                y: point.top,
            });
            canvas.remove(point);
        }

        // remove lines from canvas
        for (const line of lineArray) {
            canvas.remove(line);
        }

        // remove selected Shape and Line
        canvas.remove(activeShape).remove(activeLine);

        // create polygon from collected points
        const polygon = new fabric.Polygon(points, {
            //id: new Date().getTime(),
            ...DEFAULT_SHAPE_FEATURES,
            objectCaching: false,
            moveable: false,
            strokeDashArray: [5, 5],
            id: SHAPE_ID
        });
        canvas.add(polygon);

        toggleDrawPolygon();
        editPolygon();
    }

    function toggleDrawPolygon(event) {
        if (App.drawMode) {
            // stop draw mode
            activeLine = null;
            activeShape = null;
            lineArray = [];
            pointArray = [];
            canvas.selection = true;
            App.drawMode = false;
        } else {
            removeShapes(canvas);
            // start draw mode
            canvas.selection = false;
            App.drawMode = true;
        }
    }

    function editPolygon() {
        let activeObject = getCurrentShape(canvas);
        if (!activeObject) {
            activeObject = canvas.getObjects()[0];
            canvas.setActiveObject(activeObject);
        }

        activeObject.edit = true;
        activeObject.objectCaching = false;
        const lastControl = activeObject.points.length - 1;
        activeObject.cornerStyle = 'circle';
        activeObject.controls = activeObject.points.reduce((acc, point, index) => {
            acc['p' + index] = new fabric.Control({
                positionHandler: function (dim, finalMatrix, fabricObject) {
                    const transformPoint = {
                        x: fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
                        y: fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y,
                    };
                    return fabric.util.transformPoint(transformPoint, fabricObject.calcTransformMatrix());
                },
                actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
                actionName: 'modifyPolygon',
                pointIndex: index,
            });
            return acc;
        }, {});

        activeObject.hasBorders = false;

        canvas.requestRenderAll();
    }

    const onMouseDown = (options) => {
        if (App.drawMode) {
            if (options.target && pointArray[0] && options.target.id === pointArray[0].id) {
                // when click on the first point
                generatePolygon(pointArray);
            } else {
                addPoint(options);
            }
        }
    }

    const onMouseMove = (options) => {
        if (App.drawMode) {
            if (activeLine && activeLine.class === 'line') {
                const pointer = canvas.getPointer(options.e);
                activeLine.set({
                    x2: pointer.x,
                    y2: pointer.y
                });
                const points = activeShape.get('points');
                points[pointArray.length] = {
                    x: pointer.x,
                    y: pointer.y,
                };
                activeShape.set({
                    points
                });
            }
            canvas.renderAll();
        }
    }

    const onObjectMove = (option) => {
        let object = option.target;
        canvas.forEachObject(function(obj) {
            if (obj.name === POLYGON) {
                if (obj.PolygonNumber === object.polygonNo) {
                    let points = window["polygon" + object.polygonNo].get("points");
                    points[object.circleNo - 1].x = object.left;
                    points[object.circleNo - 1].y = object.top;
                    window["polygon" + object.polygonNo].set({
                        points: points
                    });
                }
            }
        })
        canvas.renderAll();
    }

    return {toggleDrawPolygon, onMouseDown, onMouseMove, onObjectMove}
}
