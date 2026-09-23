function Layout ({titulo, children}){
    return(
        <div className="min-h-screen bg-paper px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-6">
                    <h1 className="lg:text-2xl font-semibold tracking-wide text-center text-2xl lg:text-left text-zinc-600">
                        {titulo}
                    </h1>
                </header>
                {children}
            </div>
        </div>
    )
}

export default Layout