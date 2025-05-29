import { useLocation, Location as RouterLocation } from "react-router";

export default function PageNotFound(): React.JSX.Element {

    // Fetch the route the user tried to access
    const path: RouterLocation = useLocation();

    return (
        <>
            <section>
                <h2>Not found</h2>
                <p>The page <strong className="page-not-found">{path.pathname}</strong> could not be found.</p>
            </section>
        </>
    );
}