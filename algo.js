/* ------- From original script in html ---------- */


// create an array with nodes
var nodes = new vis.DataSet([]);

// create an array with edges
var edges = new vis.DataSet([]);

// create a network
var container = document.getElementById('mynetwork');
var data = {
    nodes: nodes,
    edges: edges
};

var options = {
    interaction:{hover:true},
    manipulation: {
        enabled: true
    }
};

var network = new vis.Network(container, data, options);

/* ----------------------------------------------- */


this.nbVisitedNodes = 0;
this.adjMat = null;
this.nbNodes = 0;



/* --------------- Funtions -------------- */

function createAdjMat() {
    var nbNodes = nodes.length;
    var mat = create2Darray(nbNodes);
    var nbEdges;

    for (var i = 0; i < nbNodes; i++) {
        for (var j = 0; j < nbNodes; j++) {
            nbEdges = numberOfEdgesBetweenNodes(i+1, j+1);
            if (nbEdges != 0) nbEdges = 1;
            mat[i][j] = nbEdges;
        }
    }

    return mat;
};


function create2Darray(n) {
    arr = [];

    for (var i = 0; i < n; i++) {
        arr[i] = [];
    }

    return arr;
}


function numberOfEdgesBetweenNodes(node1,node2) {
    return edges.get().filter(function (edge) {
        return (edge.from === node1 && edge.to === node2 )|| (edge.from === node2 && edge.to === node1);
    }).length;
};


function displayArticulationPoints() { 
    var articulationPoints = findArticulationPoints();
    var nbArticulationPoints = articulationPoints.length;
    var displayString = "There is " + nbArticulationPoints + " articulation point";
 
    for (var i = 0; i < nbArticulationPoints; i++)
        colorifyNode(articulationPoints[i]);        

    if (nbArticulationPoints > 1) {
        displayString.replace("is", "are");
        displayString.concat("s");
    }

    document.getElementById("result").innerHTML = displayString;

}


function findArticulationPoints() {
    var articulationPoints = [];

    this.adjMat = createAdjMat();
    this.nbNodes = nodes.length;

    for (var i = 0; i < nbNodes; i++) {
        if(isArticulationPoint(i)) {
            articulationPoints.push(i+1);
        }
    }

    return articulationPoints;
}


function isArticulationPoint(i) {
    this.nbVisitedNodes = 0;
    for (var c = 0; c < this.nbNodes; c++)
        this.adjMat[0][c] = 0;
    var temp = this.DFS(i);
    for (var c = 0; c < this.nbNodes; c++)
        this.adjMat[0][c] = 0;
    if (temp !== -1) {
        this.DFSwithout(temp, i);
        return this.nbVisitedNodes !== 1;
    }
    else
        return false;
};


function colorifyNode(i) {
    var nodeToBeColored = nodes.get(i);

    nodeToBeColored.color = {
        border: '#ffe000',
        background: '#fff000',
        highlight: {
            border: '#ffe000',
            background: '##ffff00'
        },
        hover: {
            border: '#ffe000',
            background: '#ffff00'
        }
    }
    nodes.update(nodeToBeColored);
}



function DFS(i) {
    var k = 0;
    var temp = -1;

    this.adjMat[0][i] = 2;
    if (i === 0) {
        for (k = 0; k < this.nbNodes; k++) {
            if ((this.adjMat[k][i] === 1) && (k !== i) && this.adjMat[0][k] !== 2) {
                temp = k;
                break;
            }
        }
        ;
        for (k = 0; k < this.nbNodes; k++) {
            if ((this.adjMat[k][i] === 1) && (k !== i) && this.adjMat[0][k] !== 2) {
                this.nbVisitedNodes++;
                this.DFS(k);
            }
        }
        ;
    }
    else {
        for (k = 0; k < this.nbNodes; k++) {
            if ((this.adjMat[i][k] === 1) && (k !== i) && this.adjMat[0][k] !== 2) {
                temp = k;
                break;
            }
        }
        ;
        for (k = 0; k < this.nbNodes; k++) {
            if ((this.adjMat[i][k] === 1) && (k !== i) && this.adjMat[0][k] !== 2) {
                this.nbVisitedNodes++;
                this.DFS(k);
            }
        }
        ;
    }
    return temp;
};


function DFSwithout(i, m) {
    var k = 0;

    this.adjMat[0][i] = 2;
    if (i === 0) {
        for (k = 0; k < this.nbNodes; k++) {
            if ((this.adjMat[k][i] === 1) && (k !== i) && (k !== m) && this.adjMat[0][k] !== 2) {
                this.nbVisitedNodes--;
                this.DFSwithout(k, m);
            }
        }
        ;
    }
    else {
        for (k = 0; k < this.nbNodes; k++) {
            if ((this.adjMat[i][k] === 1) && (k !== i) && (k !== m) && this.adjMat[0][k] !== 2) {
                this.nbVisitedNodes--;
                this.DFSwithout(k, m);
            }
        }
        ;
    }
};
