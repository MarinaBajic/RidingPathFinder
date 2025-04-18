const Instructions = () => {
    return (
        <div className="rounded-sm shadow-lg bg-white p-4 space-y-4">
            <div>
                <h3 className="text-lg font-bold mb-4">Instructions</h3>
                <p>On the map to the left:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Zoom using the controls.</li>
                    <li>Grab with mouse to move the map.</li>
                    <li>Click on a marker to see details of waypoint.</li>
                </ul>
            </div>
        </div>
    )
}

export default Instructions