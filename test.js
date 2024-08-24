import { FurAffinityClient } from 'fa.js';

const client = new FurAffinityClient('b=82e9a556-9799-43fa-ac43-5d3f4ebe284a; a=2a216b22-0368-48b2-8529-e972f99db54c; s=1');

(async () => {
  const sub = await client.getSubmission(57640699);
  console.log(sub);
})();
