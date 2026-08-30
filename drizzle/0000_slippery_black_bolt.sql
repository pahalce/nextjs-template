CREATE TABLE "todos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "todos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "todos_title_unique" UNIQUE("title")
);
--> statement-breakpoint
INSERT INTO "todos" ("title", "completed") VALUES
	('TestcontainersでDBテストを動かす', true),
	('workerごとの分離を確認する', false);
