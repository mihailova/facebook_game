# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table admin (
  id                        bigint auto_increment not null,
  username                  varchar(255),
  password                  varchar(255),
  constraint pk_admin primary key (id))
;

create table fb_user (
  id                        bigint auto_increment not null,
  uid                       bigint,
  name                      varchar(255),
  acess_token               varchar(255),
  points                    integer,
  constraint pk_fb_user primary key (id))
;

create table question (
  id                        bigint auto_increment not null,
  question                  varchar(255),
  right_answer              varchar(255),
  category                  varchar(255),
  answer1                   varchar(255),
  answer2                   varchar(255),
  answer3                   varchar(255),
  answer4                   varchar(255),
  constraint pk_question primary key (id))
;

create table user_question (
  id                        bigint auto_increment not null,
  question                  varchar(255),
  right_answer              varchar(255),
  category                  varchar(255),
  answer1                   varchar(255),
  answer2                   varchar(255),
  answer3                   varchar(255),
  username                  varchar(255),
  user_uid                  bigint,
  constraint pk_user_question primary key (id))
;




# --- !Downs

SET FOREIGN_KEY_CHECKS=0;

drop table admin;

drop table fb_user;

drop table question;

drop table user_question;

SET FOREIGN_KEY_CHECKS=1;
