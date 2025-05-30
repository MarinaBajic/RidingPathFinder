const Instructions = () => {
    return (
        <div className="text-(--color-light) p-4 space-y-4">
            <div>
                <h3 className="text-lg font-bold mb-4">Instructions</h3>
                <p>On the map below:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Click on a marker to see details of a waypoint.</li>
                    <li>Adjust the radius to highlight other waypoints within that range.</li>
                    <li>In the right top corner click to change base map and add an overlay.</li>
                    <li>Show all paths, click to show details and nearby waypoints.</li>
                    <li>Add new waypoint and delete an existing waypoint.</li>
                </ul>
            </div>
        </div>
    )
}

export default Instructions