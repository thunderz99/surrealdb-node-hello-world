import Surreal from "surrealdb.js";

const db = new Surreal("http://127.0.0.1:8000/rpc");

type Member = {
    id?: string;
    name: {
        first: string;
        last: string;
    };
    title: string;
    organization?: string;
};

type Organization = {
    id?: string;
    name: string;
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

        // Create a new organization with an id
        const org1 = await db.create<Organization>("organizations:dev", {
            name: "Dev",
        });
        console.info("org1:", org1);
        const org2 = await db.create<Organization>("organizations:sales", {
            name: "Sales",
        });
        console.info("org2:", org2);

        // Create a new member with an id
        const member1 = await db.create<Member>("members:tom", {
            title: "Team Leader",
            name: {
                first: "Tom",
                last: "Anderson",
            },
            organization: "organizations:dev",
        });
        console.info("member1:", member1);
        const member2 = await db.create<Member>("members:lucy", {
            title: "Member",
            name: {
                first: "lucy",
                last: "Tan",
            },
            organization: "organizations:sales",
        });
        console.info("member2:", member2);

        // Perform a query
        const result = await db.query(
            "SELECT * FROM members WHERE organization.name = $orgName FETCH organization",
            {
                orgName: "Dev",
            },
        );

        console.info("selectedMembers:", JSON.stringify(result));
    } catch (e) {
        console.error("ERROR", e);
    } finally {
        const members = await db.select<Member>("members");
        for (const m of members) {
            m.id && (await db.delete(m.id));
        }
        const orgs = await db.select<Organization>("organizations");
        for (const o of orgs) {
            o.id && (await db.delete(o.id));
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
