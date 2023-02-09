import Layout from "@/layouts/layout";

function Users() {
  return <div>This is list users page</div>;
}

export default Users;

Users.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
