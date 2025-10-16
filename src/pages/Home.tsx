export default function Home() {
  return (
    <div className="ml-6">
      <h1 className="text-3xl font-bold mb-4">Welcome</h1>
      <p className="text-muted-foreground mb-6">
        This is the home page of your application.
      </p>
      <a href="/about" className="text-blue-600 hover:underline">
        Learn more about us →
      </a>
    </div>
  )
}
