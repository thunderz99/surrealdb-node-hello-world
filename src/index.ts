import Surreal from "surrealdb.js";

const db = new Surreal("http://127.0.0.1:8000/rpc");

type Member = {
    id?: string;
    name: {
        first: string;
        last: string;
    };
    title: string;
    marketing: boolean;
};

async function main() {
    try {
        // Signin as a namespace, database, or root user
        await db.signin({
            user: "root",
            pass: "root",
        });

        // Select a specific namespace / database
        await db.use("test", "test");

        // Create a new person with a random id
        const created = await db.create<Member>("members:tom", {
            title: "Team Leader",
            name: {
                first: "Tom",
                last: "Anderson",
            },
            marketing: false,
        });

        console.info("created:", created);

        const created2 = await db.create<Member>("members:lucy", {
            title: "Member",
            name: {
                first: "lucy",
                last: "Tan",
            },
            marketing: false,
        });

        console.info("created2:", created2);

        // Update a person record with a specific id
        const updated = await db.change("members:lucy", {
            marketing: true,
        });

        console.info("updated:", updated);

        // Select all people records
        const members = await db.select<Member>("members");

        console.info("members:", members);

        // Perform a custom advanced query
        const groups = await db.query(
            "SELECT marketing, count() FROM type::table($tb) GROUP BY marketing",
            {
                tb: "members",
            },
        );

        console.info("groups:", groups);
    } catch (e) {
        console.error("ERROR", e);
    } finally {
        const members = await db.select<Member>("members");
        for (const m of members) {
            m.id && (await db.delete(m.id));
        }
    }
}

main()
    .then(() => {
        console.info("surrealdb hello world!");
    })
    .catch((e) => {
        console.error(e);
    })
    .finally(() => db.close());
