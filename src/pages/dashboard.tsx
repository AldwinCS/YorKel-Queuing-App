import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { session, signOut } = useAuth();

  const navigate = useNavigate();

  const handleSignOut = async () => {
    const result = await signOut();

    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-5">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Badminton Queue System
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="
              cursor-pointer
              rounded-lg
              bg-red-500
              px-4 py-2
              text-sm font-semibold text-white
              transition
              hover:bg-red-600
            "
          >
            Sign Out
          </button>
        </div>


        {/* AUTH STATUS */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Authentication Status
          </h2>

          {session ? (
            <div>
              <p className="mb-2 text-green-600">
                Logged in
              </p>

              <p className="text-sm text-gray-600">
                Email:
                <span className="ml-2 font-semibold text-gray-900">
                  {session.user.email}
                </span>
              </p>

              <p className="mt-2 text-sm text-gray-600">
                User ID:
              </p>

              <p className="mt-1 break-all text-xs text-gray-500">
                {session.user.id}
              </p>
            </div>
          ) : (
            <p className="text-red-500">
              No active session
            </p>
          )}
        </div>


        {/* TEST CARDS */}
        <div className="grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Queue
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Test your future badminton queue here.
            </p>

            <button
              className="
                mt-4 cursor-pointer
                rounded-lg
                bg-blue-600
                px-4 py-2
                text-sm font-semibold text-white
                hover:bg-blue-700
              "
            >
              Join Queue
            </button>
          </div>


          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Current Match
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              No match assigned yet.
            </p>

            <div className="mt-4 rounded-lg bg-gray-100 p-3 text-sm text-gray-600">
              Court: —
            </div>
          </div>


          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Player Status
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Current status
            </p>

            <p className="mt-3 font-semibold text-orange-500">
              Waiting
            </p>
          </div>


          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Test Navigation
            </h2>

            <div className="mt-4 flex gap-3">
              <Link
                to="/login"
                className="
                  rounded-lg
                  border border-gray-300
                  px-4 py-2
                  text-sm font-semibold text-gray-700
                  hover:bg-gray-100
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  rounded-lg
                  bg-gray-900
                  px-4 py-2
                  text-sm font-semibold text-white
                  hover:bg-gray-800
                "
              >
                Register
              </Link>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default Dashboard;