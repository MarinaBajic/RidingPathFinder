const Instructions = () => {
    return (
        <div className="text-(--color-light) p-4 space-y-4">
            <div>
                <h3 className="text-lg font-bold mb-4">Instructions</h3>
                <p>On the map below:</p>
                <ul className="list-disc list-inside mb-4">
                    <li>Click on a marker to see details of waypoint.</li>
                    <li>Adjust the radius to highlight other waypoints within that range.</li>
                </ul>
            </div>
        </div>
    )
}

export default Instructions